import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  from: String,
  user: { type: ObjectId, ref: 'User' },
  data: Object,
};
