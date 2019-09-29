import Follow from '@/mongo/models/follow';
import Notification from '@/mongo/models/notification';
import { userLoader } from '@/mongo/models/user/dataloader';

async function follow(root, args, ctx, op) {
  try {
    const { user } = ctx;
    if (!user) return { status: 403, message: '尚未登录' };

    const { _id } = args;
    // 无法关注自己
    if (_id === user) return { status: 401, message: '不要关注自己' };

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

async function follows(root, args, ctx, op) {
  try {
    const { user } = args;
    const users = await Follow.find({ user });
    console.log('follows');
    console.log(users);
    return users;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function _followsMeta(root, args, ctx, op) {
  try {
    const { user } = args;
    const data = await Follow.countDocuments({ user });
    return { count: data };
  } catch (error) {
    console.log(error);
  }
}

async function fans(root, args, ctx, op) {
  try {
    const { user } = args;

    const users = await Follow.find({ follow: user });
    return users;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

async function _fansMeta(root, args, ctx, op) {
  try {
    const { user } = args;
    const data = await Follow.countDocuments({ follow: user });
    console.log('data');
    console.log(data);
    return { count: data };
  } catch (error) {
    console.log(error);
  }
}

export default {
  Mutation: {
    follow,
  },
  Query: {
    follows,
    fans,
    _fansMeta,
    _followsMeta,
  },
  Follow: {
    user: ({ user }) => userLoader.load(user.toString()),
    follow: ({ follow: _id }) => userLoader.load(_id.toString()),
  },
};
