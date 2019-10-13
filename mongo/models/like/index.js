import mongoose from 'mongoose';
import { stringify } from 'query-string';
import config from './schema';
import { likeCountLoader, likeStatusLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新点赞数
  likeCountLoader.clear(this.user.toString());
  likeStatusLoader.clear(stringify({ like: this.like, user: this.user }));
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);

export default mongoose.model('Like', schema);
