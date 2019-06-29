
import { AuthenticationError, ApolloError } from 'apollo-server';
import Comment from '@/mongo/models/comment';
import { commentReplysLoader, replysCountLoader, replyToLoader } from '@/mongo/models/comment/dataloader';
import { userLoader } from '../../utils';


export default {
  Mutation: {
    createComment: async (root, args, ctx, op) => {
      console.log('createComment');
      const { user } = ctx;

      console.log('args');
      console.log(args);

      // if (!user) {
      //   throw new AuthenticationError('must authenticate');
      // }
      if (!user) {
        return {
          status: 403,
          message: '尚未登录',
        };
      }
      const { _id, ...params } = args;
      if (_id) {
        console.log('更新模式');
        const say = await Comment.findById(_id);
        if (say) {
          if (say.user.toString() === user) {
            await say.update(params);
            return {
              status: 200,
              message: '更新成功',
            };
          }
          return {
            status: 403,
            message: '权限不足',
          };
        } else {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }
      }

      console.log('创建模式');
      const say = await Comment.create({ ...params, user });
      console.log('say');
      console.log(say);

      if (say) {
        return {
          status: 200,
          message: '创建成功',
          data: say,
        };
      }
      return {
        status: 500,
        message: '系统异常',
      };
    },

    deleteComment: async (root, args, ctx, op) => {
      try {
        console.log('deleteComment');

        const { user } = ctx;
        // if (!user) throw new AuthenticationError('must authenticate');
        if (!user) {
          return {
            status: 403,
            message: '权限不足',
          };
        }
        const { id } = args;
        // if (!id) throw new ApolloError('参数无效', 401);
        if (!id) {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }
        const say = await Comment.findById(id);
        if (say) {
          if (say.user.toString() === user) {
            await say.remove();
            return {
              status: 200,
              message: '删除成功',
            };
          }
          return {
            status: 403,
            message: '权限不足',
          };
        } else {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  Query: {
    comment: async (root, args) => {
      const { _id } = args;
      const data = await Comment.findById(_id);
      return data;
    },
    comments: async (root, args) => {
      try {
        const { session, skip = 0, first = 5, sort = '-createdAt' } = args;

        if (!session) {
          throw new ApolloError('必须要有评论对象');
        }

        const data = await Comment
          .find({ session, commentTo: null, replyTo: null })
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _commentsMeta: async (root, args) => {
      try {
        const { session } = args;

        const data = await Comment.countDocuments({ session });
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Comment: {
    user: ({ user }) => userLoader.load(user.toString()),
    replys: ({ _id }, { first = 5 }) => commentReplysLoader.load(_id.toString()),
    replyTo: ({ replyTo }) => replyToLoader.load(replyTo.toString()),
    replyCount: ({ _id }) => replysCountLoader.load(_id.toString()),
  },
};
