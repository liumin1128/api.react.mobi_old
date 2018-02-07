import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

export default {
  Query: {
    rule: async (root, args) => {
      const data = await Rule.find({});
      return data;
    },
    say: async (root, args) => {
      const data = await Say.find({});
      return data;
    },
    user: async (root, args) => {
      console.log(args);
      console.log(args);
      console.log(args);
      console.log(args);
      console.log(args);
      const data = await User.findOne();
      return data;
    },
    // user: async (root, args) => {
    //   const data = await Say.find({});
    //   return data;
    // },
    author(root, args) { // args就是上面schema中author的入参
      return { id: 1, firstName: 'Hello', lastName: 'World' };
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
