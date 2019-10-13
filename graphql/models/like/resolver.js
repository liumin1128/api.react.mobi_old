import Like from '@/mongo/models/like';
import { userLoader } from '@/mongo/models/user/dataloader';

export default {
  Mutation: {
    like: async (root, args, ctx, op) => {
      try {
        console.log('like');

        const { user } = ctx;
        if (!user) {
          return { status: 403, message: '尚未登录' };
        }

        const { id, status = 1 } = args;

        const messageList = {
          0: '无',
          1: '喜欢',
          2: '不喜欢',
          12: '喜欢 > 不喜欢',
          21: '不喜欢 > 喜欢',
          10: '不喜欢了',
          20: '不反对了',
        };

        if (!id) {
          return { status: 401, message: '参数异常' };
        }

        const data = await Like.findOne({ id, user });

        console.log('data');
        console.log(data);

        if (data) {
          console.log('data.status, status');
          console.log(data.status, status);
          if (data.status === status) {
            await data.remove();
            return {
              status: 200,
              message: messageList[`${data.status}0`],
            };
          }
          await data.update({ status });
          return {
            status: 200,
            message: messageList[`${data.status}${status}`],
          };
        } else {
          await Like.create({ id, user, status });
          return { status: 200, message: messageList[`${status}`] };
        }
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },
  Query: {
    likes: async (root, args, ctx) => {
      try {
        const { user, status, skip = 0, first = 5, sort = '-_id' } = args;

        const data = await Like.find({ user, status })
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _likesMeta: async (root, args) => {
      try {
        const { user, status } = args;
        const data = await Like.countDocuments({ user, status });
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Like: {
    // user: ({ user }) => userLoader.load(user.toString()),
    // article: ({ id }) => articleLoader.load(id),
  },
};
