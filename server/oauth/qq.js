import { User, Oauth } from '@/mongo/modals';
import { parse } from 'query-string';
import fetch from 'node-fetch';
import qq from '@/config/qq';
import { DOMAIN, API_DOMAIN } from '@/config/base';
import request from '@/utils/fetch';
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
    // access_token,expires_in,refresh_token
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getOpenid(access_token) {
  try {
    // http://wiki.connect.qq.com/%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7openid_oauth2-0

    const url = `https://graph.qq.com/oauth2.0/me?access_token=${access_token}`;
    const data = await fetch(url, { method: 'GET' })
      .then(res => res.text())
      .then((res) => {
        let str = res.replace('callback( ', '');
        str = str.replace(' );', '');
        return JSON.parse(str);
      });
    // {"client_id":"YOUR_APPID","openid":"YOUR_OPENID"}
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getUserInfo(access_token, openid) {
  try {
    // http://wiki.connect.qq.com/get_user_info
    let url = 'https://graph.qq.com/user/get_user_info';
    url += `?access_token=${access_token}`;
    url += `&oauth_consumer_key=${qq.App_Key}`;
    url += `&openid=${openid}`;

    const data = await fetch(url, { method: 'GET' })
      .then(res => res.json());

    return data;

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
  // 用户注册
  async login(ctx) {
    console.log('新用户通过qq账号登录');
    ctx.redirect(getOauthUrl());
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;

      const { access_token } = await getAccessToken(code);

      if (!access_token) {
        console.log('qq获取access_token失败');
        ctx.redirect(DOMAIN);
      }

      const { openid } = await getOpenid(access_token);

      if (!openid) {
        console.log('qq获取openid失败');
        ctx.redirect(DOMAIN);
      }

      // 从数据库查找对应用户第三方登录信息
      // let oauth = await Oauth.findOne({ from: 'qq', 'data.openid': openid });

      // 如果不存在则创建新用户，并保存该用户的第三方登录信息
      // if (!oauth) {
      // 获取用户信息
      const userinfo = await getUserInfo(access_token, openid);

      console.log('userinfo');
      console.log(userinfo);

      // const { name: nickname, profile_image_url } = userinfo;

      // console.log('profile_image_url');
      // console.log(profile_image_url);
      // // 将用户头像上传至七牛
      // const avatarUrl = await fetchToQiniu(profile_image_url);
      // // console.log(avatarUrl);
      // const user = await User.create({ avatarUrl, nickname });
      // // await client.setAsync(user._id, user);
      // oauth = await Oauth.create({ from: 'qq', data: { ...userinfo, access_token, uid }, user });
      // // }
      // // 生成token（用户身份令牌）
      // const token = await getUserToken(oauth.user);
      // // 重定向页面到用户登录页，并返回token
      // ctx.redirect(`${DOMAIN}/login/oauth?token=${token}`);
    } catch (error) {
      ctx.redirect(DOMAIN);
      console.log('error');
      console.log(error);
    }
  }
}

export default new Qq();
