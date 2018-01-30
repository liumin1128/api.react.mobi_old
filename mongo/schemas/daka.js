import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  rule: { type: ObjectId, ref: 'Rule' },
  date: Date,
  location: Object,
  networkType: String, // 网络类型，前端会要求为wifi
  in: Number,
  inType: Number,
  out: Number,
  outType: Number,
  working: Number, // 工作时间
  leave: Number, // 请假时间
  absenteeism: Number, // 旷工时间
  photos: Array,
  description: String,
};
