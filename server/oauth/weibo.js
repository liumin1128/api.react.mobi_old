import { User, Oauth } from '@/mongo/models';
import fetch from 'node-fetch';
import weibo from '@/config/weibo';
import { DOMAIN } from '@/config/base';
import request from '@/utils/fetch';
import { fetchToQiniu } from '@/utils/qiniu';
import { getUserToken } from '@/utils/jwt';

function getOauthUrl() {
  let url = 'https://api.weibo.com/oauth2/authorize';
  url += `?client_id=${weibo.App_Key}`;
  url += `&redirect_uri=${weibo.redirect_uri}`;
  return url;
}

async function getAccessToken(code) {
  try {
    let url = 'https://api.weibo.com/oauth2/access_token';
    url += `?client_id=${weibo.App_Key}`;
    url += `&client_secret=${weibo.App_Secret}`;
    url += `&code=${code}`;
    url += '&grant_type=authorization_code';
    url += `&redirect_uri=${weibo.redirect_uri}`;

    const data = await request(url);

    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getUserInfo(access_token, uid) {
  try {
    const data = await fetch(`https://api.weibo.com/2/users/show.json?access_token=${access_token}&uid=${uid}`, { method: 'GET' })
      .then((res) => {
        return res.json();
      });
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

class Weibo {
  // 用户注册
  async login(ctx) {
    console.log('微博用户登录');
    ctx.redirect(getOauthUrl());
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;

      const data = await getAccessToken(code);
      const { access_token, uid } = data;
      if (!access_token) {
        ctx.redirect(DOMAIN);
      }

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'weibo', 'data.uid': uid });
      let userId;

      // 如果不存在则创建新用户，并保存该用户的第三方登录信息
      if (oauth) {
        // 更新三方登录信息
        console.log('更新三方登录信息');
        console.log(data);
        await oauth.update({ data });
        userId = oauth.user;
      } else {
        // 获取用户信息
        const userInfo = await getUserInfo(access_token, uid);
        const { name: nickname, profile_image_url } = userInfo;
        // // 将用户头像上传至七牛
        const avatarUrl = await fetchToQiniu(profile_image_url);
        const user = await User.create({ avatarUrl, nickname });
        oauth = await Oauth.create({ from: 'weibo', data, userInfo, user });
        userId = user._id;
      }
      // 生成token（用户身份令牌）
      const token = await getUserToken(userId);
      // 重定向页面到用户登录页，并返回token
      ctx.redirect(`${DOMAIN}/login/oauth?token=${token}`);
    } catch (error) {
      ctx.redirect(DOMAIN);

      console.log('error');
      console.log(error);
    }
  }
}

export default new Weibo();
