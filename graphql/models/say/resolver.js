import { Say } from '@/mongo/models';
import { userLoader } from '../../utils';

export default {
  Mutation: {
    SayCreate: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { input } = args;
        const say = await Say.create({ ...input, user });
        if (say) return { status: 200, message: '创建成功' };
        return { status: 504, message: '操作异常' };
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },

  Query: {
    say: async (root, args) => {
      const { _id } = args;
      const data = await Say.findById(_id);
      return data;
    },
    says: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-createdAt' } = args;

        const data = await Say
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);

        console.log('data');
        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _saysMeta: async (root, args) => {
      try {
        const data = await Say.countDocuments();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Say: {
    user: ({ user }) => userLoader.load(user),
  },
};
