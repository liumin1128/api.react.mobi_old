import Follow from '@/mongo/models/follow';
import Notification from '@/mongo/models/notification';

async function follow(root, args, ctx, op) {
  try {
    const { user } = ctx;
    if (!user) return { status: 403, message: '尚未登录' };

    const { _id } = args;
    if (_id === user) return;
    if (!_id) return { status: 401, message: '参数异常' };

    const obj = await Follow.findOne({ follow: _id, user });
    if (obj) {
      await obj.remove();
      return { status: 201, message: '已取关' };
    }

    await Follow.create({ follow: _id, user });

    Notification.create({ actionor: user, user: _id, type: 'follow' });

    return { status: 200, message: '关注成功' };
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

export default {
  Mutation: {
    follow,
  },
};
