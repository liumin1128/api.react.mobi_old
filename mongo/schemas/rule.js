import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  name: String, // 网络类型，前端会要求为wifi
  start: Number,
  end: Number,
  user: { type: ObjectId, ref: 'User' },
  location: Object,
  networkType: String, // 网络类型，前端会要求为wifi
};
