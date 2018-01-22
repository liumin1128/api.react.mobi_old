import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  rule: { type: ObjectId, ref: 'Rule' },
  location: Object,
  networkType: String, // 网络类型，前端会要求为wifi
  in: Number,
  out: Number,
};
