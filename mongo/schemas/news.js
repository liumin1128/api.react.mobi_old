import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  html: String,
  json: String,
  title: String,
  cover: String,
  description: String,
  tags: Array,
  photos: Array,
  catLabel1: String,
  catLabel2: String,
  source: String,
  user: { type: ObjectId, ref: 'User' },
};
