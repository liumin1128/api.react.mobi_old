import mongoose from 'mongoose';
import config from './schema';
import { zanCountLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新点赞数
  if (this.zanTo) {
    const key = this.zanTo.toString();
    zanCountLoader.clear(key);
  }
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);

export default mongoose.model('Zan', schema);
