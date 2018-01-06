import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  likes: Number,
  replies: Number,
  replyTo: { type: ObjectId, ref: 'Comment' },
  replyUser: { type: ObjectId, ref: 'User' },
};
