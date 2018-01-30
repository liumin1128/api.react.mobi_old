import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  date: Date,
  leave: Number, // 请假时间
  photos: Array,
  description: String,
};
