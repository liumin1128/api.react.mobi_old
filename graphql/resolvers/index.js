import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

export default {
  Query: {
    rule: async (root, args) => {
      const data = await Rule.find({});
      return data;
    },
    say: async (root, args) => {
      console.log('root, args');
      console.log(root, args);

      const { _id } = args;
      if (_id) {
        const data = await Say.findById(_id);
        return data;
      }
      const data = await Say.find({});
      return data;
    },
    author(root, args) { // args就是上面schema中author的入参
      return { id: 1, firstName: 'Hello', lastName: 'World' };
    },
  },
  Say: {
    user: async ({ user }) => {
      const data = await User.findById(user);
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