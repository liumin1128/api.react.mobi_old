import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // 用户资料
  from: String,
  user: { type: ObjectId, ref: 'User' },
  data: Object,
  userInfo: Object,
};
