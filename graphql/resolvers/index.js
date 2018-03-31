import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import mongoose from 'mongoose';
import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

const { ObjectId } = mongoose.Schema.Types;

const userLoader = new DataLoader(ids => User
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map((id) => {
    const sss = data.find((i) => {
      console.log('i');
      console.log(i);
      console.log('id');
      console.log(id);
      console.log('ObjectId(id)');
      console.log(ObjectId(id));
      return i._id === ObjectId(id);
    });
    return sss;
  })));

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
        const data = await Say.count();
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
    user: ({ user }) => userLoader.load(user),
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
