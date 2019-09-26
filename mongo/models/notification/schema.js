import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // user字段表示该条通知谁可以看见
  user: { type: ObjectId, ref: 'User' },

  // 通知类型，可选值： comment, follow, zan, system, like
  type: String,
  // 通知的发起者，如果有
  actionor: { type: ObjectId, ref: 'User' },
  // 写入时对事件的描述文本
  actionShowText: String,
  // 事件发起者的描述文本
  actionorShowText: String,
  // 被通知用户的描述文本
  userShowText: String,

  // 若通知类型为评论或点赞，应有此字段
  comment: { type: ObjectId, ref: 'Comment' },

  // 若通知类型为喜欢，应有此字段
  // like: { type: ObjectId, ref: 'Comment' },

  // 转跳地址
  path: String,
};
