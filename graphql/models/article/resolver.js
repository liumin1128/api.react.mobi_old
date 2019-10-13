import { AuthenticationError } from 'apollo-server-koa';
import Article from '@/mongo/models/article';
import { verifyPermission } from '@/mongo/models/article/utils';
import {
  likeCountLoader,
  likeStatusLoader,
} from '@/mongo/models/like/dataloader';
import { commentsCountLoader } from '@/mongo/models/comment/dataloader';
import { userLoader } from '@/mongo/models/user/dataloader';

export default {
  Mutation: {
    createArticle: async (root, args, ctx, op) => {
      console.log('createArticle');
      const { user } = ctx;
      if (!user) {
        throw new AuthenticationError('must authenticate');
      }
      const { input } = args;

      console.log('创建模式');
      const data = await Article.create({ ...input, user });
      if (data) {
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

    updateArticle: async (root, args, ctx, op) => {
      console.log('createArticle');
      const { user } = ctx;
      if (!user) {
        throw new AuthenticationError('must authenticate');
      }
      const { input, _id } = args;

      const data = await Article.findById(_id);

      if (data) {
        if (data.user.toString() === user) {
          await data.update(input);
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
    },

    deleteArticle: async (root, args, ctx, op) => {
      try {
        console.log('deleteArticle');

        const { _id } = args;
        if (!_id) {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }

        const { user } = ctx;
        const hasPermission = await verifyPermission(user, _id);
        if (!hasPermission) {
          return {
            status: 403,
            message: '权限不足',
          };
        }

        await Article.deleteOne({ _id });

        return {
          status: 200,
          message: '删除成功',
        };
      } catch (error) {
        console.log(error);

        return {
          status: 500,
          message: '系统异常',
        };
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

        console.log('data');
        console.log(data);

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
    // 管道查询的关键字session为字符型
    commentCount: ({ _id }) => commentsCountLoader.load(_id.toString()),
    likeCount: ({ _id }) => likeCountLoader.load(_id),
    // 查询当前帖子列表中，每一个帖子是否由当前用户点赞
    likeStatus: ({ _id }, args, { user }) => (user ? likeStatusLoader.load({ _id, user }) : undefined),
  },
};
