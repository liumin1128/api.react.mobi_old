import Follow from '@/mongo/models/follow';

export default {
  Mutation: {
    follow: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 403, message: '尚未登录' };

        const { _id } = args;
        if (!_id) return { status: 401, message: '参数异常' };

        const follow = await Follow.findOne({ follow: _id, user });
        if (follow) {
          await follow.remove();
          return { status: 201, message: '已取关' };
        }

        await Follow.create({ follow: _id, user });
        return { status: 200, message: '关注成功' };
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },
};
