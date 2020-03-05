import { ApolloError } from 'apollo-server';
import Dynamic from '@/mongo/models/dynamic';
import DynamicTopicModel from '@/mongo/models/dynamic/topic';

export async function dynamic(root, args) {
  try {
    const { _id } = args;
    if (!_id) return new ApolloError('id不能为空', 401);
    const data = await Dynamic.findById(_id);
    if (!data) return new ApolloError('目标不存在', 404);
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
    return new ApolloError('系统错误', 502);
  }
}

export async function dynamics(root, args) {
  try {
    const { skip = 0, first = 10, topic, user, sort = '-_id' } = args;

    let dt;
    const query = {};

    if (topic) {
      dt = await DynamicTopicModel.findOne({ number: topic });
      query.topics = { $elemMatch: { $eq: dt._id } };
    }
    if (user) {
      query.user = user;
    }

    const data = await Dynamic.find(query)
      .skip(skip)
      .limit(first)
      .sort(sort);

    return data || [];
  } catch (error) {
    console.log(error);
  }
}

export async function DynamicTopics(root, args) {
  try {
    const { skip = 0, first = 10, sort = '-_id', title } = args;
    const data = await DynamicTopicModel.find({ title: new RegExp(title) })
      .skip(skip)
      .limit(first)
      .sort(sort);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function DynamicTopic(root, args) {
  try {
    const { topic } = args;
    const data = await DynamicTopicModel.findOne({ number: topic });
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function _dynamicsMeta() {
  try {
    const data = await Dynamic.countDocuments();
    return { count: data };
  } catch (error) {
    console.log(error);
    return error;
  }
}
