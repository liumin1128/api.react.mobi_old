import mongoose from 'mongoose';
import config from './schema';
import { userDynamicCountLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新回复及、回复数
  userDynamicCountLoader.clear(this.user.toString());
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);

export default mongoose.model('Dynamic', schema);
