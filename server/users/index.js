// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
import { User } from '../../mongo/modals';
import { getUserToken } from '../../utils/jwt';
import { sentSMS } from '../../utils/sms';

class UserController {
  // 用户注册
  async register(ctx) {
    const { phone } = ctx.request.body;
    console.log('phone');
    console.log(phone);
    const aaa = await sentSMS(18629974148, 'amor08');
    console.log('aaa');
    console.log(aaa);
    ctx.body = phone;
  }
  // 获取用户信息
  async getUserInfo(ctx) {
    const { data: id } = ctx.state.user;
    const user = await User.findById(id);
    ctx.body = {
      data: user,
    };
  }

  // 用户登录
  async login(ctx) {
    const params = ctx.request.body;
    const { password } = params;

    delete params.password;

    const user = await User.findOne(params);

    if (password === user.password) {
      const token = await getUserToken(user._id);
      ctx.body = {
        token,
        user,
      };
    } else {
      ctx.throw(403, '用户名或密码不正确');
    }
  }

  // 用户退出
  async logout(ctx) {
    ctx.body = 'logout';
  }

  // 更新用户资料
  async put(ctx) {
    ctx.body = 'put';
  }

  // 删除用户
  async deluser(ctx) {
    ctx.body = 'deluser';
  }

  // 重置密码
  async resetpwd(ctx) {
    ctx.body = 'teresetpwdst';
  }
}

export default new UserController();
