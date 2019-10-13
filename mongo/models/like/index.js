import mongoose from 'mongoose';
import { stringify } from 'query-string';
import config from './schema';
// import {
//   followCountLoader,
//   fansCountLoader,
//   followStatusLoader,
// } from './dataloader';

// function refreshDataloader(next) {
//   // 刷新点赞数
//   followCountLoader.clear(this.user.toString());
//   fansCountLoader.clear(this.follow.toString());
//   followStatusLoader.clear(stringify({ follow: this.follow, user: this.user }));
//   next();
// }

const schema = new mongoose.Schema(config);

// schema.pre('save', refreshDataloader);
// schema.pre('remove', refreshDataloader);

export default mongoose.model('Like', schema);
