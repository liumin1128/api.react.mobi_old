
import DataLoader from 'dataloader';
import uniq from 'lodash/uniq';
import Comment from './index';

// 根据commentTo，拿到评论的回复
export const commentReplysLoader = new DataLoader(ids => Promise.all(
  ids.map(id => Comment.find({ commentTo: id }).limit(5) || []),
));

// 根据commentTo，拿到评论回复数
export const replysCountLoader = new DataLoader(ids => Comment
  .aggregate([
    { $match: { commentTo: { $in: ids } } },
    { $group: { _id: '$commentTo', count: { $sum: 1 } } },
  ])
  .then(data => ids.map(id => (data.find(i => `${i._id}` === `${id}`) || { count: 0 }).count))
  .catch((err) => { console.log(err); }));

// 根据replyTo，拿到回复内容
export const replyToLoader = new DataLoader(ids => Comment
  .find({ _id: { $in: uniq(ids) } })
  .then(data => ids.map(id => data.find(i => `${i._id}` === `${id}`)))
  .catch((err) => { console.log(err); }));
