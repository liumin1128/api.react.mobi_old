import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

export default {
  name: String, // 打卡规则名
  times: [Number], // 规则适用时间段
  standard: [Number], // 标准时间段，若未打卡，则按标准时间计算
  // user: { type: ObjectId, ref: 'User' },
  location: Object,
  networkType: String, // 网络类型，前端会要求为wifi
};
