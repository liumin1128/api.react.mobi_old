import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  user: { type: ObjectId, ref: 'User' },
  commentTo: { type: ObjectId, ref: 'Article' },
  replyTo: { type: ObjectId, ref: 'Comment' },
  replyUser: { type: ObjectId, ref: 'User' },
};
