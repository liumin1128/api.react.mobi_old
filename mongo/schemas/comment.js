import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  replyTo: { type: ObjectId, ref: 'Comment' },
  thumb: [
    { type: ObjectId, ref: 'Comment' },
  ],
  reply: [
    { type: ObjectId, ref: 'Comment' },
  ],
  likes: Number,
  replies: Number,
};
