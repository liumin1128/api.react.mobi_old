import mongoose from 'mongoose';
import config from './schema';
// import { commentReplysLoader, replysCountLoader, commentsCountLoader, commentsAndRelysCountLoader } from './dataloader';

// function refreshDataloader(next) {
//   // 刷新回复及、回复数
//   if (this.commentTo) {
//     const key = this.commentTo.toString();
//     commentReplysLoader.clear(key);
//     replysCountLoader.clear(key);
//   }
//   if (this.session) {
//     const key = this.session;
//     commentsCountLoader.clear(key);
//     commentsAndRelysCountLoader.clear(key);
//   }
//   // 甚至可以使用prime来扩充存缓，但风险较大
//   next();
// }

const schema = new mongoose.Schema(config);

// schema.pre('save', refreshDataloader);
// schema.pre('remove', refreshDataloader);

export default mongoose.model('DynamicTopic', schema);
