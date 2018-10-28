import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  id: { type: ObjectId, ref: 'Article' },
  user: { type: ObjectId, ref: 'User' },
  unlike: Boolean,
};
