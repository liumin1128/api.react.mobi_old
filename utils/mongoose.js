import mongoose from 'mongoose';
import algoliasearch from 'algoliasearch';
import { ENV } from '@/config/base';
import { APP_ID, ADMIN_KEY } from '@/config/algolia';

// 解决了graphql的bug
// https://github.com/apollographql/apollo-server/issues/1633
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function() {
  return this.toString();
};

// const client = algoliasearch(APP_ID, ADMIN_KEY);

// const index = client.initIndex('test_test');

mongoose.connect(
  ENV
    ? 'mongodb://localhost:27017/react'
    : 'mongodb://react:lol970568830@localhost:27000/react',
  { useNewUrlParser: true },
);

// mongoose.connect(
//   'mongodb://localhost:27017/react',
//   { useNewUrlParser: true },
//   // initAlgolia,
// );

mongoose.set('debug', ENV);
mongoose.Promise = global.Promise;

// function initAlgolia() {
//   mongoose.collection('news', (err, collection) => {
//     // iterate over the whole collection using a cursor
//     let batch = [];
//     collection.find().forEach((doc) => {
//       batch.push(doc);
//       if (batch.length > 10000) {
//         // send documents by batch of 10000 to Algolia
//         index.addObjects(batch);
//         batch = [];
//       }
//     });
//     // last batch
//     if (batch.length > 0) {
//       index.addObjects(batch);
//     }
//   });
// }
