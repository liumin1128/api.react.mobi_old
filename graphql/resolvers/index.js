import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import { Daka, User, Say, Rule, Leave, Article } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

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
    test: async (...args) => {
      console.log('args');
      console.log(args);
      // const data = await Say.findById('59f83ebc0c14d24450c64605');
      // return data;
      return '操作成功';
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
  },
  Say: {
    user: ({ user }) => userLoader.load(user),
  },
  Article: {
    user: ({ user }) => userLoader.load(user),
  },
};
