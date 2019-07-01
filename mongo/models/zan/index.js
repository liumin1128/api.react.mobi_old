import mongoose from 'mongoose';
import { stringify } from 'query-string';
import config from './schema';
import { zanCountLoader, zanStatusLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新点赞数
  const key = this.zanTo.toString();
  zanCountLoader.clear(key);
  zanStatusLoader.clear(stringify({ zanTo: this.zanTo, user: this.user }));
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);

export default mongoose.model('Zan', schema);
