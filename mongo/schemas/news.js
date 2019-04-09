import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  html: String,
  json: String,
  title: String,
  source: String,
  url: String,
  cover: String,
  description: String,
  tags: Array,
  photos: Array,
  user: { type: ObjectId, ref: 'User' },
  sourceData: Object,
};
