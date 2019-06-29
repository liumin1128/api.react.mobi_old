import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  content: String,
  session: String,
  user: { type: ObjectId, ref: 'User' },
  commentTo: { type: ObjectId, ref: 'Comment' },
  replyTo: { type: ObjectId, ref: 'Comment' },
};
