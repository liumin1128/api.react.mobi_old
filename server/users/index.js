import { User } from '../../mongo/modals';
import { getUserToken } from '../../utils/jwt';
import { getAsync } from '../../utils/redis';
import joi, { phoneSchema, nicknameSchema, codeSchema, passwordSchema } from '../../utils/joi';

class UserController {
  // 用户注册
  async register(ctx) {
    try {
      let {
        phone, nickname, password, code,
      } = ctx.request.body;
      phone = await joi(phone, phoneSchema);
      nickname = await joi(nickname, nicknameSchema);
      password = await joi(password, passwordSchema);
      code = await joi(code, codeSchema);
      const key = `p${phone}c${code}`;

      // 校验验证码
      const _code = await getAsync(key);
      if (_code !== code) {
        ctx.body = {
          status: 403,
          message: '验证码不正确',
        };
        return;
      }

      // 根据提交的用户名查找用户
      let user = await User.findOne({ username: phone });
      if (user) {
        ctx.body = {
          status: 403,
          message: `${phone} 已被使用`,
        };
        return;
      }

      // 创建用户
      user = await User.create({
        username: phone, phone, nickname, password,
      });
      const token = await getUserToken(user._id);

      // 返回用户信息及token
      ctx.body = {
        status: 200,
        message: '注册成功',
        token,
        userInfo: user,
      };
    } catch (error) {
      // ctx.status = 403;
      if (error.isJoi) {
        ctx.body = {
          status: 403,
          message: '参数错误',
        };
      }
      // ctx.body = error;
    }
  }
  // 获取用户信息
  async getUserInfo(ctx) {
    const { data: id } = ctx.state.user;
    const user = await User.findById(id);
    ctx.body = {
      status: 200,
      userInfo: user,
    };
  }

  // 用户登录
  async login(ctx) {
    try {
      const { password, ...other } = ctx.request.body;
      const user = await User.findOne(other);
      if (user && `${password}` === user.password) {
        const token = await getUserToken(user._id);
        ctx.body = {
          status: 200,
          token,
          userInfo: user,
        };
      } else {
        ctx.body = {
          status: 403,
          message: '用户名或密码不正确',
        };
      }
    } catch (error) {
      ctx.body = {
        status: 403,
        message: '登录失败',
        error,
      };
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
