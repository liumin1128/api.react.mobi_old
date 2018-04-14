import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import { User } from '../../mongo/modals';

export const userLoader = new DataLoader(ids => User
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`))));

export const resolverCombine = (...args) => {
  return {
    ...[...args.map(({ Mutation, Query, ...other }) => other)],
    Mutation: { ...args.map(({ Mutation }) => Mutation) },
    Query: { ...args.map(({ Query }) => Query) },
  };
};
