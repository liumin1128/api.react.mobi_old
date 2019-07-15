import { URLSearchParams } from 'url';
import config from '@/config/outlook';
import fetch from '@/utils/fetch';
import { User, Oauth } from '@/mongo/models';
import { DOMAIN } from '@/config/base';
import { getUserToken } from '@/utils/jwt';
import { sentOutlookEmail } from '@/utils/outlook';

async function getOauth(code) {
  console.log('new user just submitted the code');
  console.log(`code：${code}`);

  // 下面构造个post请求，换取用户信息
  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

  const params = {
    // client_id：通过注册应用程序生成的客户端ID
    client_id: config.client_id,
    // client_secret：通过注册应用程序生成的客户端密钥。
    client_secret: config.client_secret,
    // code：在前一步骤中获得的授权码。
    code,
    // redirect_uri：此值必须与授权代码请求中使用的值相同。
    redirect_uri: config.redirect_uri,
    // grant_type：应用程序使用的授权类型。对于授权授权流程，应始终如此authorization_code
    grant_type: config.grant_type,
  };

  const paramsTemp = new URLSearchParams();

  Object.keys(params).map((key) => {
    paramsTemp.append(key, params[key]);
  });

  // 这些参数被编码为application/x-www-form-urlencoded内容类型并发送到令牌请求URL。
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: paramsTemp,
  };
  const data = await fetch(url, {}, options);
  const buff = Buffer.from(data.id_token.split('.')[1], 'base64');
  const result = JSON.parse(buff.toString());
  result.token = data;

  return result;
}

class OauthClass {
  // 用户注册
  async login(ctx) {
    console.log('a new user want to login in outlook');
    console.log('config');
    console.log(config);

    // 重定向到认证接口,并配置参数
    let path = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';

    // client_id 通过注册应用程序生成的客户端ID。这使Azure知道哪个应用程序正在请求登录。
    path += `?client_id=${config.client_id}`;

    // redirect_uri 一旦用户同意应用程序，Azure将重定向到的位置。此值必须与注册应用程序时使用的重定向URI的值相对应
    path += `&redirect_uri=${encodeURI(config.redirect_uri)}`;

    // response_type 应用程序期望的响应类型。对于授权授权流程，应始终如此code
    path += `&response_type=${config.response_type}`;

    // scope 您的应用所需的以空格分隔的访问范围列表。有关Microsoft Graph中Outlook范围的完整列表
    // 具体参考：https://developer.microsoft.com/graph/docs/authorization/permission_scopes
    path += `&scope=${config.scope}`;

    // 转发到授权服务器
    ctx.redirect(path);
  }

  async callback(ctx) {
    try {
      const { code } = ctx.query;
      const result = await getOauth(code);
      let userId;


      // 从数据库查找对应用户第三方登录信息
      let oauth = await Oauth.findOne({ from: 'outlook', 'data.preferred_username': result.preferred_username });
      if (!oauth) {
        // 前面半天都是为了获取用户在此app的唯一标识，username，拿稳存好
        const { preferred_username: username, name: nickname } = result;
        // outlook 暂时不知道怎么拿用户头像
        const user = await User.create({ username, nickname, avatarUrl: 'https://imgs.react.mobi/FthXc5PBp6PrhR7z9RJI6aaa46Ue' });
        // 用户第三方信息存一下
        oauth = await Oauth.create({ from: 'outlook', data: result, user });
        userId = user._id;
      } else {
        await oauth.update({ data: result });
        // todo 刷新一下用户信息，避免token过期
        userId = oauth.user;
      }

      // 生成token（用户身份令牌）
      const token = await getUserToken(userId);

      //
      //
      // 这里注意，我们使用简易方式，直接将jwt传给前端，
      // 如果安全性要求较高，或者有过期时间的需求，可以使用redis存缓token，只将引索传给前端
      //
      //
      // 重定向页面到用户登录页，并返回token
      ctx.redirect(`${DOMAIN}/login/oauth?token=${token}`);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }

  async test(ctx) {
    try {
      const params = {
        subject: "Did you see last night's game?",
        importance: 'Low',
        body: {
          contentType: 'HTML',
          content: 'They were <b>awesome</b>!',
        },
        toRecipients: [
          {
            emailAddress: {
              address: '970568830@qq.com',
            },
          },
        ],
      };

      const data2 = await sentOutlookEmail('5b73ab77c8476f10abb5401f', params);

      console.log('data2');
      console.log(data2);

      ctx.body = JSON.stringify(data2);
    } catch (error) {
      console.log('error');
      console.log(error);
    }
  }
}

export default new OauthClass();
