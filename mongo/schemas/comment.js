import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  content: String,
  id: ObjectId,
  user: { type: ObjectId, ref: 'User' },
  reply_to: ObjectId,
  thumbs_up: Number,
  replay_num: Number,
};
