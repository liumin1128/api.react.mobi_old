import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

export default {
  Query: {
    rule: async (root, args) => {
      const data = await Rule.find({});
      return data;
    },
    says: async (root, args) => {
      console.log('root, args');
      console.log(root, args);
      // const { first, offset } = args;
      const { page = 1, limit = 10, ...other } = args;

      const count = await Say.count({})
        .skip((page === 0 ? page : page - 1) * limit)
        .limit(limit);

      const data = await Say.find({})
        .skip((page === 0 ? page : page - 1) * limit)
        .populate('user', POPULATE_USER)
        .limit(limit);
        // .sort(sort);

      console.log('data');
      console.log(data);

      return {
        count,
        data,
        isEnd: (page === 0 ? 1 : page) * limit > count,
      };
    },
    say: async (root, args) => {
      console.log('root, args');
      console.log(root, args);
      const { _id } = args;
      const data = await Say.findById(_id);
      return data;
    },
    author(root, args) { // args就是上面schema中author的入参
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    },
  },
  Say: {
    user: async (args) => {
      console.log('user args');
      console.log(args);
      const data = await User.findById({});
      return data;
    },
  },
  Author: {
    // 定义author中的posts
    posts(author) {
      return [
        {
          id: 1, title: 'A post', text: 'Some text', views: 2,
        },
        {
          id: 2, title: 'Another post', text: 'Some other text', views: 200,
        },
      ];
    },
  },
  Post: {
    // 定义Post里面的author
    author(post) {
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    },
  },
};
