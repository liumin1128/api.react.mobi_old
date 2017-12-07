import github from '../../config/github';
import fetch from '../../utils/fetch';
import { User, Oauth } from '../../mongo/modals';
import { DOMAIN } from '../../config';
import { fetchToQiniu } from '../../utils/qiniu';
import { getUserToken } from '../../utils/jwt';

// import { client } from '../../utils/redis';

class Github {
  // 用户注册
  async login(ctx) {
    console.log('用户登录');
    const dataStr = (new Date()).valueOf();
    // 重定向到认证接口,并配置参数
    let path = 'https://github.com/login/oauth/authorize';
    path += `?client_id=${github.client_id}`;
    path += `&scope=${github.scope}`;
    path += `&state=${dataStr}`;
    // 转发到授权服务器
    ctx.redirect(path);
  }
  async callback(ctx) {
    try {
      const { code } = ctx.query;
      console.log('已获取用户code');
      // 用token换取access_token
      const au = 'https://github.com/login/oauth/access_token';
      const params = { client_id: github.client_id, client_secret: github.client_secret, code };
      const { access_token: accessToken } = await fetch(au, params);
      // 获取用户信息
      const userinfo = await fetch(`https://api.github.com/user?access_token=${accessToken}`);

      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'github', 'data.login': userinfo.login });

      if (!oauth) {
        console.log('新用户注册2');
        // 如果不存在则创建新用户，并保存该用户的第三方登录信息
        const { avatar_url, name } = userinfo;

        // 将用户头像上传至七牛
        const avatarUrl = await fetchToQiniu(avatar_url);
        console.log('avatarUrl');
        console.log(avatarUrl);
        const user = await User.create({ avatarUrl, nickname: name });
        // await client.setAsync(user._id, user);
        oauth = await Oauth.create({ from: 'github', data: userinfo, user });
      }
      // 生成token（用户身份令牌）
      const token = await getUserToken(oauth.user);
      // 重定向页面到用户登录页，并返回token
      ctx.redirect(`${DOMAIN}/oauth?token=${token}`);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}

export default new Github();
