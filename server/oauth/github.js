import github from '@/config/github';
import fetch from '@/utils/fetch';
import { User, Oauth } from '@/mongo/modals';
import { DOMAIN } from '@/config/base';
import { fetchToQiniu } from '@/utils/qiniu';
import { getUserToken } from '@/utils/jwt';

// https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

function getOauthUrl() {
  const dataStr = (new Date()).valueOf();
  let url = 'https://github.com/login/oauth/authorize';
  url += `?client_id=${github.client_id}`;
  url += `&scope=${github.scope}`;
  url += `&state=${dataStr}`;
  return url;
}

async function getAccessToken(code) {
  try {
    // 文档地址
    // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842

    const url = 'https://github.com/login/oauth/access_token';
    const params = { client_id: github.client_id, client_secret: github.client_secret, code };
    const data = await fetch(url, params);

    return data;
    // 返回值示例
    // {"access_token":"e72e16c7e42f292c6912e7710c838347ae178b4a",
    // "scope":"repo,gist",
    // "token_type":"bearer"}
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function getUserInfo(access_token) {
  try {
    const data = await fetch(`https://api.github.com/user?access_token=${access_token}`);
    return data;
    // 返回值示例
    //   {
    //     "login": "Diamondtest",
    //     "id": 28478049,
    //     "avatar_url": "https://avatars0.githubusercontent.com/u/28478049?v=3",
    //     "gravatar_id": "",
    //     "url": "https://api.github.com/users/Diamondtest",
    //     "html_url": "https://github.com/Diamondtest",
    //     "followers_url": "https://api.github.com/users/Diamondtest/followers",
    //     "following_url": "https://api.github.com/users/Diamondtest/following{/other_user}",
    //     "gists_url": "https://api.github.com/users/Diamondtest/gists{/gist_id}",
    //     "starred_url": "https://api.github.com/users/Diamondtest/starred{/owner}{/repo}",
    //     "subscriptions_url": "https://api.github.com/users/Diamondtest/subscriptions",
    //     "organizations_url": "https://api.github.com/users/Diamondtest/orgs",
    //     "repos_url": "https://api.github.com/users/Diamondtest/repos",
    //     "events_url": "https://api.github.com/users/Diamondtest/events{/privacy}",
    //     "received_events_url": "https://api.github.com/users/Diamondtest/received_events",
    //     "type": "User",
    //     "site_admin": false,
    //     "name": null,
    //     "company": null,
    //     "blog": "",
    //     "location": null,
    //     "email": null,
    //     "hireable": null,
    //     "bio": null,
    //     "public_repos": 0,
    //     "public_gists": 0,
    //     "followers": 0,
    //     "following": 0,
    //     "created_at": "2017-05-06T08:08:09Z",
    //     "updated_at": "2017-05-06T08:16:22Z"
    // }
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

class Github {
  // 用户注册
  async login(ctx) {
    console.log('github用户登录');
    ctx.redirect(getOauthUrl());
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;

      const data = await getAccessToken(code);
      const { access_token } = data;

      // github得先去获取用户信息才能知道唯一id
      const userInfo = await getUserInfo(access_token);
      const { id } = userInfo;

      data.id = id;

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'github', 'data.id': id });

      if (oauth) {
        // 更新三方登录信息
        console.log('更新三方登录信息');
        console.log(data);
        await oauth.update({ data, userInfo });
      } else {
        // 如果不存在则创建新用户，并保存该用户的第三方登录信息
        const { avatar_url, name, login } = userInfo;
        const nickname = name || login;
        const avatarUrl = await fetchToQiniu(avatar_url);
        const user = await User.create({ avatarUrl, nickname });
        oauth = await Oauth.create({ from: 'github', data, userInfo, user });
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

export default new Github();
