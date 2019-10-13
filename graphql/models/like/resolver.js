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

        const { id, unlike = false } = args;

        if (!id) {
          return { status: 401, message: '参数异常' };
        }

        const data = await Like.findOne({ id, user });

        if (data) {
          if (data.unlike === unlike) {
            await data.remove();
            return { status: 200, message: unlike ? '不反对了' : '不喜欢了' };
          }
          await data.update({ unlike });
          return {
            status: 200,
            message: unlike ? '喜欢 => 反对' : '反对 => 喜欢',
          };
        } else {
          await Like.create({ id, user, unlike });
          return { status: 200, message: unlike ? '反对' : '喜欢' };
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
        const { user, unlike, skip = 0, first = 5, sort = '-_id' } = args;

        const data = await Like.find({ user, unlike })
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
        const { user, unlike } = args;
        const data = await Like.countDocuments({ user, unlike });
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Like: {
    user: ({ user }) => userLoader.load(user.toString()),
    // article: ({ id }) => articleLoader.load(id),
  },
};
