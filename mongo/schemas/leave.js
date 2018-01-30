import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  user: { type: ObjectId, ref: 'User' },
  hours: Number, // 请假时间
  photos: Array,
  description: String,
  end: Date,
  start: Date,
  type: Number,
};
