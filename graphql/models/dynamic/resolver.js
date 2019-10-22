import { stringify } from 'query-string';
import Dynamic from '@/mongo/models/dynamic';
import DynamicTopic from '@/mongo/models/dynamic/topic';
import { dynamicTopicLoader } from '@/mongo/models/dynamic/topic/dataloader';
import { zanCountLoader, zanStatusLoader } from '@/mongo/models/zan/dataloader';
import { commentsAndRelysCountLoader } from '@/mongo/models/comment/dataloader';
import { userLoader } from '@/mongo/models/user/dataloader';
import { getTopic, getTopics } from './topic.js';

export default {
  Mutation: {
    DynamicCreate: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { input } = args;
        const { content } = input;

        let topics = [];
        const topicStrList = getTopic(content);
        if (topicStrList) {
          topics = await getTopics(topicStrList);
        }

        const dynamic = await Dynamic.create({ ...input, user, topics });
        if (dynamic) return { status: 200, message: '创建成功', data: dynamic };
        return { status: 504, message: '操作异常' };
      } catch (error) {
        console.log('error');
        console.log(error);
        return { status: 504, message: '操作异常' };
      }
    },

    DynamicUpdate: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { input, _id } = args;
        const { content } = input;

        let topics = [];
        const topicStrList = getTopic(content);
        if (topicStrList) {
          topics = await getTopics(topicStrList);
        }

        const dynamic = await Dynamic.findById(_id);

        if (!dynamic) return { status: 401, message: '对象不存在或已被删除' };

        if (`${dynamic.user}` !== user) return { status: 403, message: '权限不足' };

        await dynamic.updateOne({ ...input, topics });

        return { status: 200, message: '更新成功', data: dynamic };
      } catch (error) {
        console.log('error');
        console.log(error);
        return { status: 504, message: '操作异常' };
      }
    },

    RemoveDynamic: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };
        const { _id } = args;

        const dynamic = await Dynamic.findById(_id);

        if (!dynamic) return { status: 401, message: '对象不存在或已被删除' };

        if (`${dynamic.user}` !== user) return { status: 403, message: '权限不足' };

        await dynamic.remove();

        return { status: 200, message: '删除成功', data: dynamic };
      } catch (error) {
        console.log('error');
        console.log(error);
        return { status: 504, message: '操作异常' };
      }
    },

    CheckNewDynamic: async (root, args) => {
      try {
        const { latest } = args;
        const data = await Dynamic.countDocuments({
          createdAt: { $gt: latest },
        });

        if (data > 0) {
          return {
            status: 200,
            message: '有新数据',
          };
        } else {
          return {
            status: 201,
            message: '没有有新数据',
          };
        }
      } catch (error) {
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
        const { skip = 0, first = 10, topic, user, sort = '-_id' } = args;

        let dt;
        const query = {};

        if (topic) {
          dt = await DynamicTopic.findOne({ number: topic });
          query.topics = { $elemMatch: { $eq: dt._id } };
        }
        if (user) {
          query.user = user;
        }

        const data = await Dynamic.find(query)
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

        const data = await DynamicTopic.find({ title: new RegExp(title) })
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
    topics: ({ topics }) => Promise.all(
      topics.map(({ _id }) => dynamicTopicLoader.load(_id.toString())),
    ),
    zanCount: ({ _id }) => zanCountLoader.load(_id.toString()),
    zanStatus: ({ _id }, _, { user }) => (user ? zanStatusLoader.load(stringify({ zanTo: _id, user })) : false),
    commentCount: ({ _id }) => commentsAndRelysCountLoader.load(_id.toString()),
  },
};
