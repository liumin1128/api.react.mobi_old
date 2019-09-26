import mongoose from 'mongoose';
// import { stringify } from 'query-string';
import config from './schema';
// import { followCountLoader, followStatusLoader } from './dataloader';
import { getActionShowText } from './utils.js';

// function refreshDataloader(next) {
//   // 刷新点赞数
//   const key = this.follow.toString();
//   followCountLoader.clear(key);
//   followStatusLoader.clear(stringify({ follow: this.follow, user: this.user }));
//   next();
// }

function save(next) {
  this.actionShowText = getActionShowText(this.type);
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', save);
// schema.pre('remove', refreshDataloader);

const Notification = mongoose.model('Notification', schema);

export default Notification;
