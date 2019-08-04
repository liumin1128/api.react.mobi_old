import mongoose from 'mongoose';
import config from './schema';
import { userLoader } from './dataloader';

function refreshDataloader(next) {
  // 刷新回复及、回复数
  if (this.user) {
    console.log(`更新用户：${this.user}`);
    const user = this.user.toString();
    userLoader.clear(user);
  }

  // 刷新回复及、回复数
  if (this._conditions && this._conditions._id) {
    console.log(`更新用户：${this._conditions._id}`);
    userLoader.clear(this._conditions._id);
  }

  // 甚至可以使用prime来扩充存缓，但风险较大
  next();
}

const schema = new mongoose.Schema(config);

schema.pre('save', refreshDataloader);
schema.pre('remove', refreshDataloader);
schema.pre('updateOne', refreshDataloader);

export default mongoose.model('User', schema);
