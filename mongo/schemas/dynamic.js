import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  title: String,
  url: String,
  pictures: Array,
  user: { type: ObjectId, ref: 'User' },
};
