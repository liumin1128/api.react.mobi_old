import { stringify } from 'query-string';
import { dynamicTopicLoader } from '@/mongo/models/dynamic/topic/dataloader';
import { zanCountLoader, zanStatusLoader } from '@/mongo/models/zan/dataloader';
import { commentsAndRelysCountLoader } from '@/mongo/models/comment/dataloader';
import { userLoader } from '@/mongo/models/user/dataloader';

import {
  DynamicCreate,
  DynamicUpdate,
  RemoveDynamic,
  CheckNewDynamic,
} from './mutation';

import {
  dynamic,
  dynamics,
  DynamicTopics,
  DynamicTopic,
  _dynamicsMeta,
} from './query';

export default {
  Mutation: {
    DynamicCreate,
    DynamicUpdate,
    RemoveDynamic,
    CheckNewDynamic,
  },

  Query: {
    dynamic,
    dynamics,
    DynamicTopics,
    DynamicTopic,
    _dynamicsMeta,
  },

  Dynamic: {
    user: ({ user }) => userLoader.load(user.toString()),
    topics: ({ topics }) =>
      Promise.all(
        topics.map(({ _id }) => dynamicTopicLoader.load(_id.toString())),
      ),
    zanCount: ({ _id }) => zanCountLoader.load(_id.toString()),
    zanStatus: ({ _id }, _, { user }) =>
      user ? zanStatusLoader.load(stringify({ zanTo: _id, user })) : false,
    commentCount: ({ _id }) => commentsAndRelysCountLoader.load(_id.toString()),
  },
};
