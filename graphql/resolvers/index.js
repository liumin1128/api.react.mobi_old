import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import { Daka, User, Say, Rule, Leave } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

const userLoader = new DataLoader(ids => User
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`))));

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
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
    say: async (root, args) => {
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
};
