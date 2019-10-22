import Dynamic from '@/mongo/models/dynamic';
import { getTopic, getTopics } from './topic.js';

export async function DynamicCreate(root, args, ctx, op) {
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
}

export async function DynamicUpdate(root, args, ctx, op) {
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
}

export async function RemoveDynamic(root, args, ctx, op) {
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
}

export async function CheckNewDynamic(root, args) {
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
}
