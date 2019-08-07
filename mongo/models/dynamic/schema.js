import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  content: String,
  title: String,
  url: String,
  pictures: Array,
  topics: [{ type: ObjectId, ref: 'DynamicTopic' }],
  user: { type: ObjectId, ref: 'User' },
};
