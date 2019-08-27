import { verify } from '@/utils/jwt';
import User from '@/mongo/models/user';

export async function verifyMail(ctx) {
  try {
    const { token } = ctx.request.query;
    if (!token) {
      ctx.body = {
        status: 401,
        message: '参数错误',
      };
      return;
    }
    const { data } = await verify(token);

    if (!data || !data.user || !data.email) {
      ctx.body = {
        status: 401,
        message: '验证信息失效',
      };
      return;
    }

    const user = await User.findById(data.user);

    if (!user) {
      ctx.body = {
        status: 403,
        message: '用户不存在',
      };
      return;
    }

    if (!user.unverified_email || user.unverified_email !== data.email) {
      ctx.body = {
        status: 401,
        message: '验证信息已过期',
      };
      return;
    }

    await user.updateOne({
      email: user.unverified_email,
      unverified_email: undefined,
    });

    ctx.body = {
      status: 200,
      message: '邮箱验证成功',
    };
  } catch (error) {
    ctx.body = {
      status: 500,
      message: '验证失败',
      error,
    };
  }
}
