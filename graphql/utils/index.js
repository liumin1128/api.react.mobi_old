import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';

import { User, Comment, Article, Like } from '@/mongo/models';

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
    { $match: { session: { $in: ids } } },
    { $group: { _id: '$session', count: { $sum: 1 } } },
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

export const likeStatusLoader = new DataLoader(params => Like
  .find({ id: { $in: uniq(params.map(i => i._id)) } })
  // .then(data => params.map(({ _id, user }) => (
  // data.find(i => `${i.id}` === `${_id}` && `${i.user}` === `${user}`))))
  .then(data => params.map(({ _id, user }) => {
    const temp = data.find(i => `${i.id}` === `${_id}` && `${i.user}` === `${user}`);
    if (temp) {
      return temp.unlike ? 'unlike' : 'like';
    } else {
      return 'none';
    }
  }))
  .catch((err) => { console.log(err); }));


// ids => Promise.all(ids.map(id => Comment.count({ session: id }))),
// .then((data) => {
//   console.log('data');
//   console.log(data);
//   return data;
// }),

// export const commentCountLoader = new DataLoader(ids => Comment
// .find({ session: { $in: uniq(ids) } })
// .then(list => Promise.all(ids.map(id => list.find(i => `${i.session}` === `${id}`).count())))
// .then(list => Promise.all(ids.map(id => list.find(i => `${i.session}` === `${id}`).count())))
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
