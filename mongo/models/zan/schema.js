import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  user: { type: ObjectId, ref: 'User' },
  zanTo: { type: ObjectId, ref: 'Comment' },
};
