import { User, Oauth } from '@/mongo/modals';
import { parse } from 'query-string';
import fetch from 'node-fetch';
import { DOMAIN, API_DOMAIN } from '@/config/base';
import qq from '@/config/qq';
import { fetchToQiniu } from '@/utils/qiniu';
import { getUserToken } from '@/utils/jwt';

function getOauthUrl() {
  let url = 'https://graph.qq.com/oauth2.0/authorize';
  url += `?client_id=${qq.App_Id}`;
  url += `&redirect_uri=${API_DOMAIN}/oauth/qq/callback`;
  url += '&state=state123';
  url += '&scope=get_user_info';
  url += '&response_type=code';
  return url;
}

async function getAccessToken(code) {
  try {
    // 文档地址
    // http://wiki.connect.qq.com/%E4%BD%BF%E7%94%A8authorization_code%E8%8E%B7%E5%8F%96access_token

    let url = 'https://graph.qq.com/oauth2.0/token';
    url += `?client_id=${qq.App_Id}`;
    url += `&client_secret=${qq.App_Key}`;
    url += `&code=${code}`;
    url += '&grant_type=authorization_code';
    url += `&redirect_uri=${API_DOMAIN}/oauth/qq/callback`;

    const data = await fetch(url, { method: 'GET' })
      .then(res => res.text())
      .then(res => parse(res));

    return data;
    // 返回值示例
    // access_token,expires_in,refresh_token
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getOpenid(access_token) {
  try {
    // 文档地址
    // http://wiki.connect.qq.com/%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7openid_oauth2-0

    const url = `https://graph.qq.com/oauth2.0/me?access_token=${access_token}`;
    const data = await fetch(url, { method: 'GET' })
      .then(res => res.text())
      .then((res) => {
        let str = res.replace('callback( ', '');
        str = str.replace(' );', '');
        return JSON.parse(str);
      });

    return data;
    // 返回值示例
    // {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"}
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getUserInfo(access_token, openid) {
  try {
    // 文档地址
    // http://wiki.connect.qq.com/get_user_info
    let url = 'https://graph.qq.com/user/get_user_info';
    url += `?access_token=${access_token}`;
    url += `&oauth_consumer_key=${qq.App_Id}`;
    url += `&openid=${openid}`;

    const data = await fetch(url, { method: 'GET' })
      .then(res => res.json());

    return data;
    // 返回值示例
    // {
    //   "ret":0,
    //   "msg":"",
    //   "nickname":"Peter",
    //   "figureurl":"http://qzapp.qlogo.cn/qzapp/111111/942FEA70050EEAFBD4DCE2C1FC775E56/30",
    //   "figureurl_1":"http://qzapp.qlogo.cn/qzapp/111111/942FEA70050EEAFBD4DCE2C1FC775E56/50",
    //   "figureurl_2":"http://qzapp.qlogo.cn/qzapp/111111/942FEA70050EEAFBD4DCE2C1FC775E56/100",
    //   "figureurl_qq_1":"http://q.qlogo.cn/qqapp/100312990/DE1931D5330620DBD07FB4A5422917B6/40",
    //   "figureurl_qq_2":"http://q.qlogo.cn/qqapp/100312990/DE1931D5330620DBD07FB4A5422917B6/100",
    //   "gender":"男",
    //   "is_yellow_vip":"1",
    //   "vip":"1",
    //   "yellow_vip_level":"7",
    //   "level":"7",
    //   "is_yellow_year_vip":"1"
    //   }
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

class Qq {
  async login(ctx) {
    console.log('qq账号登录');
    ctx.redirect(getOauthUrl());
  }

  async callback(ctx) {
    console.log('qq账号登录回调');
    try {
      const { code } = ctx.query;

      const data = await getAccessToken(code);
      const { access_token } = data;

      if (!access_token) {
        console.log('qq获取access_token失败');
        ctx.redirect(DOMAIN);
      }

      const { openid } = await getOpenid(access_token);
      if (!openid) {
        console.log('qq获取openid失败');
        ctx.redirect(DOMAIN);
      }

      // qq比较特殊，openid居然还要再单独获取一次
      data.openid = openid;

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'qq', 'data.openid': openid });

      if (oauth) {
        // 更新三方登录信息
        console.log('更新三方登录信息');
        console.log(data);
        oauth.update({ data });
      } else {
        // 如果不存在则获取用户信息，创建新用户，并保存该用户的第三方登录信息
        const userInfo = await getUserInfo(access_token, openid);
        const { nickname, figureurl_qq_1, figureurl_qq_2 } = userInfo;
        // 将用户头像上传至七牛，避免头像过期或无法访问
        const avatarUrl = await fetchToQiniu(figureurl_qq_2 || figureurl_qq_1);
        // 创建该用户
        const user = await User.create({ avatarUrl, nickname });
        // 创建三方登录信息
        oauth = await Oauth.create({ from: 'qq', data, userInfo, user });
      }

      // 生成token（用户身份令牌）
      const token = await getUserToken(oauth.user);
      // 重定向页面到用户登录页，并返回token
      ctx.redirect(`${DOMAIN}/login/oauth?token=${token}`);
    } catch (error) {
      ctx.redirect(DOMAIN);
      console.log('error');
      console.log(error);
    }
  }
}

export default new Qq();
