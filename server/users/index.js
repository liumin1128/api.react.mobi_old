// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
import { User } from '../../mongo/modals';
import { getUserToken } from '../../utils/jwt';
import { getAsync } from '../../utils/redis';
import joi, { phoneSchema, nicknameSchema, codeSchema } from '../../utils/joi';

class UserController {
  // 用户注册
  async register(ctx) {
    try {
      let { phone, nickname, code } = ctx.request.body;
      phone = await joi(phone, phoneSchema);
      nickname = await joi(nickname, nicknameSchema);
      code = await joi(code, codeSchema);
      const key = `p${phone}c${code}`;
      // 校验验证码
      const _code = await getAsync(key);
      if (_code !== code) ctx.throw(403, '验证码不正确');
      // 根据提交的用户名查找用户
      let user = await User.findOne({ phone });
      if (user) ctx.throw(403, `${phone} 已被使用`);
      // 创建用户
      user = await User.create({ phone, nickname });
      const token = await getUserToken(user._id);
      // 返回用户信息及token
      ctx.body = {
        token,
        userInfo: user,
      };
    } catch (error) {
      ctx.status = 403;
      ctx.body = error;
    }
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
