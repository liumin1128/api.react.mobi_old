import { User, Oauth } from '@/mongo/modals';
import { DOMAIN, API_DOMAIN } from '@/config/base';
import wechat from '@/config/wechat';
import fetch from '@/utils/fetch';
import { fetchToQiniu } from '@/utils/qiniu';
import { getUserToken } from '@/utils/jwt';

function getOauthUrl() {
  let url = 'https://open.weixin.qq.com/connect/qrconnect';
  url += `?appid=${wechat.appid}`;
  url += `&redirect_uri=${API_DOMAIN}/oauth/wechat/callback`;
  url += '&response_type=code&scope=snsapi_login&state=123#wechat_redirect ';
  return url;
}

async function getAccessToken(code) {
  try {
    // 文档地址
    // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842

    let url = 'https://api.weixin.qq.com/sns/oauth2/access_token';
    url += `?appid=${wechat.appid}`;
    url += `&secret=${wechat.secret}`;
    url += `&code=${code}`;
    url += '&grant_type=authorization_code';

    const data = await fetch(url);

    return data;
    // 返回值示例
    //     { "access_token":"ACCESS_TOKEN",
    // "expires_in":7200,
    // "refresh_token":"REFRESH_TOKEN",
    // "openid":"OPENID",
    // "scope":"SCOPE" }
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getUserInfo(access_token, openid) {
  try {
    // 文档地址
    // http://wiki.connect.qq.com/get_user_info

    let url = 'https://api.weixin.qq.com/sns/userinfo';
    url += `?access_token=${access_token}`;
    url += `&openid=${openid}`;
    url += '&lang=zh_CN';

    const data = await fetch(url);
    return data;
    // 返回值示例
    //     {    "openid":" OPENID",
    // " nickname": NICKNAME,
    // "sex":"1",
    // "province":"PROVINCE"
    // "city":"CITY",
    // "country":"COUNTRY",
    // "headimgurl":    "http://thirdwx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46",
    // "privilege":[ "PRIVILEGE1" "PRIVILEGE2"     ],
    // "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
    // }
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

class WeChat {
  async login(ctx) {
    console.log('微信账号登录');
    ctx.redirect(getOauthUrl());
  }

  async callback(ctx) {
    try {
      console.log('微信账号登录回调');
      const { code } = ctx.query;

      const data = await getAccessToken(code);
      const { access_token, openid, unionid } = data;
      if (!access_token) {
        console.log('微信获取access_token失败');
        ctx.redirect(DOMAIN);
      }

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'wechat', 'data.unionid': unionid });

      if (oauth) {
        // 更新三方登录信息
        await oauth.update({ data });
      } else {
        // 如果不存在则获取用户信息，创建新用户，并保存该用户的第三方登录信息
        const userInfo = await getUserInfo(access_token, openid);
        const { nickname, headimgurl } = userInfo;
        // 将用户头像上传至七牛，避免头像过期或无法访问
        const avatarUrl = await fetchToQiniu(headimgurl);
        // 创建该用户
        const user = await User.create({ avatarUrl, nickname });
        // 创建三方登录信息
        oauth = await Oauth.create({ from: 'wechat', data, userInfo, user });
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

export default new WeChat();
