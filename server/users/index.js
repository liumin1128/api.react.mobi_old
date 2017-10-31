// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
import { User } from '../../mongo/modals';

class UserController {
  // 用户注册
  async register(ctx) {
    const { user } = ctx;
    console.log(user);
    ctx.body = user;
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
    ctx.body = 'login';
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
