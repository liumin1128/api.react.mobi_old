import mongoose from 'mongoose';
import { stringify } from 'query-string';
import config from './schema';
import { followCountLoader, followStatusLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新点赞数
  const key = this.follow.toString();
  followCountLoader.clear(key);
  followStatusLoader.clear(stringify({ follow: this.follow, user: this.user }));
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);

export default mongoose.model('Follow', schema);
