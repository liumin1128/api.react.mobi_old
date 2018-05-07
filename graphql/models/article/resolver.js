
import { Article } from '../../../mongo/modals';
import { userLoader } from '../../utils';
import { throwError } from '../../utils/error';


export default {
  Mutation: {
    createArticle: async (root, args, ctx, op) => {
      console.log('createArticle');
      const { user } = ctx;
      throwError({ message: '尚未登录！', data: { status: 403 } });
      if (!user) {
        throwError({ message: '尚未登录！', data: { status: 403 } });
      }
      const { input } = args;
      console.log('createArticle input');
      console.log(input);
      const say = await Article.create({ ...input, user });
      return say;
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
        const { skip = 0, first = 10, sort = '-createdAt' } = args;
        const data = await Article
          .find({})
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
    user: ({ user }) => userLoader.load(user),
  },
};
