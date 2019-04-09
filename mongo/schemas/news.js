import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;


export default {
  html: String,
  json: String,
  title: String,
  appName: String,
  appCode: String,
  url: String,
  cover: String,
  content: String,
  showHtml: Boolean,
  tags: Array,
  photos: Array,
  user: { type: ObjectId, ref: 'User' },
  sourceData: Object,
};
