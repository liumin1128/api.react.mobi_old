import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import { User, Comment, Article, Like } from '@/mongo/modals';

export const userLoader = new DataLoader(ids => User
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => { console.log(err); }));

export const articleLoader = new DataLoader(ids => Article
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => { console.log(err); }));

export const commentCountLoader = new DataLoader(ids => Comment
  .aggregate([
    { $match: { commentTo: { $in: ids } } },
    { $group: { _id: '$commentTo', count: { $sum: 1 } } },
  ])
  .then(data => ids.map(id => (data.find(i => `${i._id}` === `${id}`) || { count: 0 }).count))
  .catch((err) => { console.log(err); }));

export const likeCountLoader = new DataLoader(ids => Like
  .aggregate([
    { $match: { id: { $in: ids }, unlike: false } },
    { $group: { _id: '$id', count: { $sum: 1 } } },
  ])
  .then(data => ids.map(id => (data.find(i => `${i._id}` === `${id}`) || { count: 0 }).count))
  .catch((err) => { console.log(err); }));

// ids => Promise.all(ids.map(id => Comment.count({ commentTo: id }))),
// .then((data) => {
//   console.log('data');
//   console.log(data);
//   return data;
// }),

// export const commentCountLoader = new DataLoader(ids => Comment
// .find({ commentTo: { $in: uniq(ids) } })
// .then(list => Promise.all(ids.map(id => list.find(i => `${i.commentTo}` === `${id}`).count())))
// .then(list => Promise.all(ids.map(id => list.find(i => `${i.commentTo}` === `${id}`).count())))
// .then((data) => {
//   console.log('data');
//   console.log(data);
// }));

export const resolverCombine = (...args) => {
  let temp = {};
  args.map(({ Mutation, Query, ...other }) => {
    temp = {
      ...temp,
      ...other,
      Mutation: { ...temp.Mutation, ...Mutation },
      Query: { ...temp.Query, ...Query },
    };
  });
  return temp;
};
