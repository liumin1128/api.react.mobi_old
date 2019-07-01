
import Zan from '@/mongo/models/zan';

export default {
  Mutation: {
    zan: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 403, message: '尚未登录' };

        const { _id } = args;
        if (!_id) return { status: 401, message: '参数异常' };

        const zan = await Zan.findOne({ zanTo: _id, user });
        if (zan) {
          await zan.remove();
          return { status: 201, message: '已取消赞' };
        }

        await Zan.create({ zanTo: _id, user });
        return { status: 200, message: '点赞成功' };
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },
};
