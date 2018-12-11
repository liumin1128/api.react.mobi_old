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
    const data = await fetch(
      `https://graph.qq.com/oauth2.0/me?access_token=${access_token}`,
      { method: 'GET' },
    ).then((res) => {
      console.log('res');
      console.log(res);
      console.log('res.text()');
      console.log(res.text());
      return res.json();
    });
    return data;
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

      console.log('code');
      console.log(code);

      const { access_token } = await getAccessToken(code);
      console.log('access_token');
      console.log(access_token);
      if (!access_token) {
        console.log('qq获取access_token失败');
        ctx.redirect(DOMAIN);
      }

      const { openid } = await getOpenid(access_token);
      console.log('openid');
      console.log(openid);
      if (!openid) {
        console.log('qq获取openid失败');
        ctx.redirect(DOMAIN);
      }
      return;

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'qq', 'data.uid': uid });

      // 如果不存在则创建新用户，并保存该用户的第三方登录信息
      if (!oauth) {
        // 获取用户信息
        const userinfo = await fetch(`https://api.qq.com/2/users/show.json?access_token=${access_token}&uid=${uid}`, { method: 'GET' })
          .then((res) => {
            return res.json();
          });

        const { name: nickname, profile_image_url } = userinfo;

        // console.log('profile_image_url');
        // console.log(profile_image_url);
        // // 将用户头像上传至七牛
        const avatarUrl = await fetchToQiniu(profile_image_url);
        // console.log(avatarUrl);
        const user = await User.create({ avatarUrl, nickname });
        // await client.setAsync(user._id, user);
        oauth = await Oauth.create({ from: 'qq', data: { ...userinfo, access_token, uid }, user });
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
