import { Dynamic } from '@/mongo/models';
import { userLoader } from '../../utils';

export default {
  Mutation: {
    DynamicCreate: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { input } = args;
        const dynamic = await Dynamic.create({ ...input, user });
        if (dynamic) return { status: 200, message: '创建成功' };
        return { status: 504, message: '操作异常' };
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },

  Query: {
    dynamic: async (root, args) => {
      const { _id } = args;
      const data = await Dynamic.findById(_id);
      return data;
    },
    dynamics: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-_id' } = args;

        const data = await Dynamic
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
    _dynamicsMeta: async (root, args) => {
      try {
        const data = await Dynamic.countDocuments();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Dynamic: {
    user: ({ user }) => userLoader.load(user.toString()),
  },
};
