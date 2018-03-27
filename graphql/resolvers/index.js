import DataLoader from 'dataloader';
import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';


const userLoader = new DataLoader(ids => User.find({ _id: { $in: ids } }));
// const aaa = userLoader.load('59f83e9a0c14d24450c64603');
// const bbb = userLoader.load('5a0013c91b977c5b76939cc1');

// Promise.all([aaa, bbb]).then(([user1, user2]) => {
//   console.log(user1, user2);
// });

export default {
  Query: {
    says: async (root, args) => {
      try {
        const { skip = 0, first = 10 } = args;
        const data = await Say.find({})
          .skip(skip)
          .limit(first);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _saysMeta: async (root, args) => {
      try {
        // const data = await Say.count();
        return {
          count: 99,
        };
      } catch (error) {
        console.log(error);
      }
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
    user: async (user) => {
      const data = await userLoader.load(user);
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
