import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  location: Object,
  networkType: String, // 网络类型，前端会要求为wifi
  time: Number,
  type: Number, // 打卡类型 0 上班 1 下班
};
