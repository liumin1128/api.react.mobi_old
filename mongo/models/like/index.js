import mongoose from 'mongoose';
import { stringify } from 'query-string';
import config from './schema';
import {
  likeCountLoader,
  likeOrDislikeStatusLoader,
  // likeStatusLoader,
} from './dataloader';

function refreshDataloader(next) {
  // 刷新点赞数
  likeCountLoader.clear(this.id);
  // likeStatusLoader.clear(stringify({ like: this.like, user: this.user }));
  likeOrDislikeStatusLoader.clear(stringify({ id: this.id, user: this.user }));
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);
schema.pre('update', refreshDataloader);

export default mongoose.model('Like', schema);
