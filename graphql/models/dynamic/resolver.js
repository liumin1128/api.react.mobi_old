// import { Dynamic } from '@/mongo/models';
import Dynamic from '@/mongo/models/dynamic';
import DynamicTopic from '@/mongo/models/dynamic/topic';
import uniq from 'lodash/uniq';
import { sequence } from '@/utils/promise';
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
        console.log('content');
        console.log(content);
        const topics = getTopic(content);
        console.log('topics');
        console.log(topics);
        if (topics) {
          await sequence(topics.map(topic => async () => {
            const that = await DynamicTopic.findOne({ title: topic });
            if (that) return;
            const last = await DynamicTopic.findOne().sort('_id');
            const number = (last || { number: 1000 }).number + 1;
            await DynamicTopic.create({ title: topic, number });
          }));
        }
        const dynamic = await Dynamic.create({ ...input, user });
        if (dynamic) return { status: 200, message: '创建成功', data: dynamic };
        return { status: 504, message: '操作异常' };
      } catch (error) {
        console.log('error');
        console.log(error);
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
        const { skip = 0, first = 10, sort = '-_id' } = args;

        const data = await Dynamic
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);

        console.log('data');
        console.log(data);

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
  },
};
