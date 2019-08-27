export default {
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // 用户资料
  nickname: String,
  avatarUrl: String,
  sex: Number,
  sign: String,
  birthday: Date,
  position: String,
  company: String,
  countryCode: String,

  // 系统信息
  username: String,
  email: String,
  unverified_email: String,
  purePhoneNumber: String,
  phoneNumber: String,
  password: String,
};
