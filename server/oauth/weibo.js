import { User, Oauth } from '@/mongo/modals';
import weibo from '@/config/weibo';
import { DOMAIN } from '@/config/base';
import fetch from '@/utils/fetch';
import { fetchToQiniu } from '@/utils/qiniu';
import { getUserToken } from '@/utils/jwt';

class Weibo {
  // 用户注册
  async login(ctx) {
    console.log('新用户登录');
    // const dataStr = (new Date()).valueOf();
    // 重定向到认证接口,并配置参数

    let path = 'https://api.weibo.com/oauth2/authorize';
    path += `?client_id=${weibo.App_Key}`;
    path += `&redirect_uri=${weibo.redirect_uri}`;
    // path += '&response_type=code&scope=snsapi_login&state=123#weibo_redirect ';
    // 转发到授权服务器
    ctx.redirect(path);
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;

      console.log('code');
      console.log(code);
      // 用token换取access_token
      let au = 'https://api.weibo.com/oauth2/access_token';
      au += `?client_id=${weibo.App_Key}`;
      au += `&client_secret=${weibo.App_Secret}`;
      au += `&code=${code}`;
      au += '&grant_type=authorization_code';

      const data = await fetch(au);

      console.log('data');
      console.log(data);

      ctx.body = data;

      // // 从数据库查找对应用户第三方登录信息
      // let oauth = await Oauth.findOne({ from: 'weibo', 'data.uid': uid });

      // // 如果不存在则创建新用户，并保存该用户的第三方登录信息
      // if (!oauth) {
      //   // 获取用户信息
      //   const userinfo = await fetch(`https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`);
      //   const { nickname, headimgurl } = userinfo;

      //   // 将用户头像上传至七牛
      //   const avatarUrl = await fetchToQiniu(headimgurl);
      //   // console.log(avatarUrl);

    //   const user = await User.create({ avatarUrl, nickname });
    //   // await client.setAsync(user._id, user);
    //   oauth = await Oauth.create({ from: 'weibo', data: userinfo, user });
    // }
    // // 生成token（用户身份令牌）
    // const token = await getUserToken(oauth.user);
    // // 重定向页面到用户登录页，并返回token
    // ctx.redirect(`${DOMAIN}/login/oauth?token=${token}`);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}

export default new Weibo();
