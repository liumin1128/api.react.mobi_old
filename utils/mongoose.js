import mongoose from 'mongoose';
// import { ENV } from '@/config/base';

// 解决了graphql的bug
// https://github.com/apollographql/apollo-server/issues/1633
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};


// mongoose.connect(ENV ? 'mongodb://localhost:27017/react' : 'mongodb://react:lol970568830@localhost:27000/react', { useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/react', { useNewUrlParser: true });
mongoose.set('debug', true);
mongoose.Promise = global.Promise;
