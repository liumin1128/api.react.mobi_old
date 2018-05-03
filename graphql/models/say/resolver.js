import { Say } from '../../../mongo/modals';
import { userLoader } from '../../utils';
import { todayInHistory } from '../../../utils/showapi';

export default {
  Mutation: {
    createSay: async (root, args, ctx, op) => {
      const { user } = ctx;
      if (!user) {
        ctx.body = {
          status: 401,
          messge: '尚未登录',
        };
        return;
      }
      const { input } = args;
      const say = await Say.create({ ...input, user });
      return say;
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
        const ssss = await todayInHistory('1128');
        console.log('ssss');
        console.log(ssss);

        const { skip = 0, first = 10, sort = '-createdAt' } = args;

        const data = await Say
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _saysMeta: async (root, args) => {
      try {
        const data = await Say.count();
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
