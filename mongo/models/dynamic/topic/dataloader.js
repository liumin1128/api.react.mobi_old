
import mongoose from 'mongoose';
import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import Comment from './index';

const { ObjectId } = mongoose.Types;

// 根据session，拿到评论和回复合计数量
export const commentsAndRelysCountLoader = new DataLoader(sessions => Promise.all(
  sessions.map(session => Comment.countDocuments({ session })),
));
// aggregate可以实现，但尽量不使用
// export const commentsAndRelysCountLoader = new DataLoader(sessions => Comment
//   .aggregate([
//     { $match: { session: { $in: sessions } } },
//     { $group: { _id: '$session', count: { $sum: 1 } } },
//   ])
// .then(data => sessions.map(id => (data.find(i => `${i._id}` === `${id}`) || { count: 0 }).count))
//   .catch((err) => { console.log(err); }));

// 根据session，拿到评论数量
export const commentsCountLoader = new DataLoader(sessions => Promise.all(
  sessions.map(session => Comment.countDocuments({ session, commentTo: null, replyTo: null })),
));

// 根据commentTo，拿到评论的回复
export const commentReplysLoader = new DataLoader(ids => Promise.all(
  ids.map(id => Comment.find({ commentTo: id }).limit(5).sort('-_id') || []),
  // ids.map(([id, first]) => Comment.find({ commentTo: id }).limit(first) || []),
));

// 根据commentTo，拿到评论回复数
export const replysCountLoader = new DataLoader(ids => Comment
  .aggregate([
    { $match: { commentTo: { $in: ids.map(i => new ObjectId(i)) } } },
    { $group: { _id: '$commentTo', count: { $sum: 1 } } },
  ])
  .then(data => ids.map(id => (data.find(i => `${i._id}` === `${id}`) || { count: 0 }).count))
  .catch((err) => { console.log(err); }));

// 根据replyTo，拿到回复内容
export const replyToLoader = new DataLoader(ids => Comment
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => { console.log(err); }));
