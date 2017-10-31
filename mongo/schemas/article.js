import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  title: String,
  user: { type: ObjectId, ref: 'User' },
};
