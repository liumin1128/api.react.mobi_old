import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
};
