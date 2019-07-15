// import { Dynamic } from '@/mongo/models';
import { stringify } from 'query-string';
import Dynamic from '@/mongo/models/dynamic';
import DynamicTopic from '@/mongo/models/dynamic/topic';
import uniq from 'lodash/uniq';
import { sequence } from '@/utils/promise';
import { dynamicTopicLoader } from '@/mongo/models/dynamic/topic/dataloader';
import { zanCountLoader, zanStatusLoader } from '@/mongo/models/zan/dataloader';
import { commentsAndRelysCountLoader } from '@/mongo/models/comment/dataloader';
import { userLoader } from '../../utils';

function getTopic(str) {
  const list = str.match(/#(\S*?)#/g);
  if (!list) return null;
  return uniq(list
    .map(i => i.replace(/#/g, ''))
    .filter(i => i));
}

export default {
  Mutation: {
    DynamicCreate: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { input } = args;
        const { content } = input;
        const topicStrList = getTopic(content);
        const topics = [];
        if (topicStrList) {
          await sequence(topicStrList.map(topic => async () => {
            const that = await DynamicTopic.findOne({ title: topic });
            if (that) {
              topics.push(that);
              return;
            }
            const last = await DynamicTopic.findOne().sort('-_id');
            const number = (last || { number: 1000 }).number + 1;
            const data = await DynamicTopic.create({ title: topic, number });
            topics.push(data);
          }));
        }
        const dynamic = await Dynamic.create({ ...input, user, topics });
        console.log('dynamic');
        console.log(dynamic);
        if (dynamic) return { status: 200, message: '创建成功', data: dynamic };
        return { status: 504, message: '操作异常' };
      } catch (error) {
        console.log('error');
        console.log(error);
        return { status: 504, message: '操作异常' };
      }
    },
  },

  Query: {
    dynamic: async (root, args) => {
      const { _id } = args;
      const data = await Dynamic.findById(_id);
      return data;
    },
    dynamics: async (root, args) => {
      try {
        const { skip = 0, first = 10, topic, user, sort = '-_id' } = args;

        let dt;
        if (topic) {
          dt = await DynamicTopic.findOne({ number: topic });
        }

        const data = await Dynamic
          .find(dt ? { topics: { $elemMatch: { $eq: dt._id } } } : {})
          .skip(skip)
          .limit(first)
          .sort(sort);

        // console.log('data');
        // console.log(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    DynamicTopics: async (root, args) => {
      try {
        const { skip = 0, first = 10, sort = '-_id', title } = args;

        const data = await DynamicTopic
          .find({ title: new RegExp(title) })
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    DynamicTopic: async (root, args) => {
      try {
        const { topic } = args;

        const data = await DynamicTopic.findOne({ number: topic });

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _dynamicsMeta: async (root, args) => {
      try {
        const data = await Dynamic.countDocuments();
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Dynamic: {
    user: ({ user }) => userLoader.load(user.toString()),
    topics: ({ topics }) => Promise.all(topics.map(({ _id }) => dynamicTopicLoader.load(_id.toString()))),
    zanCount: ({ _id }) => zanCountLoader.load(_id.toString()),
    zanStatus: ({ _id }, _, { user }) => (user ? zanStatusLoader.load(stringify({ zanTo: _id, user })) : false),
    commentCount: ({ _id }) => commentsAndRelysCountLoader.load(_id.toString()),
  },
};
