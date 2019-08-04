import { Article } from '@/mongo/models';
import {
  commentCountLoader,
  likeCountLoader,
  likeStatusLoader,
} from '../../utils';
import { AuthenticationError } from 'apollo-server-koa';
import { userLoader } from '@/mongo/models/user/dataloader';

export default {
  Mutation: {
    createArticle: async (root, args, ctx, op) => {
      console.log('createArticle');
      const { user } = ctx;
      if (!user) {
        throw new AuthenticationError('must authenticate');
      }
      const {
        input: { _id, ...params },
      } = args;
      if (_id) {
        console.log('更新模式');
        const dynamic = await Article.findById(_id);
        if (dynamic) {
          if (dynamic.user.toString() === user) {
            await dynamic.update(params);
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
      const dynamic = await Article.create({ ...params, user });
      if (dynamic) {
        return {
          status: 200,
          message: '创建成功',
        };
      }
      return {
        status: 500,
        message: '系统异常',
      };
    },

    deleteArticle: async (root, args, ctx, op) => {
      try {
        console.log('deleteArticle');

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
        const dynamic = await Article.findById(id);
        if (dynamic) {
          if (dynamic.user.toString() === user) {
            await dynamic.remove();
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
    article: async (root, args) => {
      const { _id } = args;
      const data = await Article.findById(_id);
      return data;
    },
    articles: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-_id' } = args;
        const data = await Article.find({})
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _articlesMeta: async (root, args) => {
      try {
        const data = await Article.count();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Article: {
    user: ({ user }) => userLoader.load(user.toString()),

    // commentCount: ({ _id }) => commentCountLoader.load(_id.toString()),
    // 管道查询的关键字session为字符型
    commentCount: ({ _id }) => commentCountLoader.load(_id),
    likeCount: ({ _id }) => likeCountLoader.load(_id),

    // 查询当前帖子列表中，每一个帖子是否由当前用户点赞
    likeStatus: ({ _id }, args, { user }) => (user ? likeStatusLoader.load({ _id, user }) : undefined),
  },
};
