import User from '@/mongo/models/user';
import { md5Encode } from '@/utils/crypto';
import { getUserToken } from '@/utils/jwt';

export async function login(ctx) {
  try {
    const { password, ...other } = ctx.request.body;
    const user = await User.findOne(other).lean();
    const pwMd5 = md5Encode(password);
    if (user && `${pwMd5}` === user.password) {
      const token = await getUserToken(user._id);
      ctx.body = {
        status: 200,
        message: '登录成功',
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
