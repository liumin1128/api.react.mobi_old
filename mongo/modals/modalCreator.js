import mongoose from 'mongoose';

const { Schema } = mongoose;

function save(next) {
  if (this.isNew) this.createdAt = Date.now();
  this.updatedAt = Date.now();
  next();
}

export default (name, schema, cb) => {
  const temp = new Schema(schema);

  // 这样写是因为func-names规则表示尽量不要用匿名函数
  temp.pre('save', save);

  // 这里留下钩子，万一需要加属性还可以用下
  if (cb) cb(temp);

  return mongoose.model(name, temp);
};
