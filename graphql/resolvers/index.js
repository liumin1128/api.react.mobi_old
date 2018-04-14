import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import { Daka, User, Say, Rule, Leave, Article } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';
import { getUrlByName, getArticleList } from '../../server/wechatCrawler';

const userLoader = new DataLoader(ids => User
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`))));

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
    createArticle: async (root, args, ctx, op) => {
      const { user } = ctx;
      if (!user) {
        ctx.body = {
          status: 401,
          messge: '尚未登录',
        };
        return;
      }
      const { input } = args;
      const say = await Article.create({ ...input, user });
      return say;
    },
  },
  Query: {
    wechat: async (root, args) => {
      const url = await getUrlByName('人民日报');
      const list = await getArticleList(url);
      return list;
    },
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
    _articlesMeta: async (root, args) => {
      try {
        const data = await Article.count();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Say: {
    user: ({ user }) => userLoader.load(user),
  },
  Article: {
    user: ({ user }) => userLoader.load(user),
  },
};
