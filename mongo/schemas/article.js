import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  html: String,
  json: String,
  title: String,
  cover: String,
  description: String,
  tags: Array,
  user: { type: ObjectId, ref: 'User' },
};
