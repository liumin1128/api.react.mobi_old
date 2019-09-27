import { AuthenticationError, ApolloError } from 'apollo-server';
import { stringify } from 'query-string';
import Comment from '@/mongo/models/comment';
import {
  commentReplysLoader,
  replysCountLoader,
  replyToLoader,
  commentsCountLoader,
  commentsAndRelysCountLoader,
} from '@/mongo/models/comment/dataloader';
import { zanCountLoader, zanStatusLoader } from '@/mongo/models/zan/dataloader';
import { userLoader } from '@/mongo/models/user/dataloader';
import Notification from '@/mongo/models/notification';
import Dynamic from '@/mongo/models/dynamic';

async function CreateNotification({ _id, type, actionor, actionorShowText }) {
  try {
    let content;
    let user;
    if (type === 'commentToDynamic') {
      const dynamic = await Dynamic.findById(_id);
      if (!dynamic) return;
      user = dynamic.user;
      content = dynamic.content;
    }
    if (type === 'commentToComment') {
      const comment = await Comment.findById(_id);
      if (!comment) return;
      user = comment.user;
      content = comment.content;
    }
    await Notification.create({
      user,
      actionor,
      type: 'comment',
      userShowText: content,
      actionorShowText,
    });
  } catch (error) {
    console.log(error);
  }
}

export default {
  Mutation: {
    createComment: async (root, args, ctx, op) => {
      console.log('createComment');
      const { user } = ctx;

      if (!user) return { status: 403, message: '尚未登录' };

      const { _id, ...params } = args;
      if (_id) {
        console.log('更新模式');
        const data = await Comment.findById(_id);
        if (data) {
          if (data.user.toString() === user) {
            await data.update(params);
            return {
              status: 200,
              message: '更新成功',
            };
          }
          return {
            status: 403,
            message: '权限不足',
          };
        } else {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }
      }

      console.log('创建模式');
      const data = await Comment.create({ ...params, user });

      CreateNotification({
        // replyTo 回复评论，session评论场景
        _id: params.replyTo || params.session,
        actionor: user,
        actionorShowText: data.content,
        type: !params.replyTo ? 'commentToDynamic' : 'commentToComment',
      });

      if (data) {
        return {
          status: 200,
          message: '创建成功',
          data,
        };
      }
      return {
        status: 500,
        message: '系统异常',
      };
    },
    deleteComment: async (root, args, ctx, op) => {
      try {
        console.log('deleteComment');

        const { user } = ctx;
        // if (!user) throw new AuthenticationError('must authenticate');
        if (!user) {
          return {
            status: 403,
            message: '权限不足',
          };
        }
        const { _id } = args;
        // if (!_id) throw new ApolloError('参数无效', 401);
        if (!_id) {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }

        const data = await Comment.findById(_id);
        if (data) {
          if (data.user.toString() === user) {
            await data.remove();
            await Comment.find({ commentTo: _id }).remove();
            return {
              status: 200,
              message: '删除成功',
            };
          }
          return {
            status: 403,
            message: '权限不足',
          };
        } else {
          return {
            status: 401,
            message: '目标不存在或已被删除',
          };
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  Query: {
    comment: async (root, args) => {
      const { _id } = args;
      const data = await Comment.findById(_id);
      return data;
    },
    comments: async (root, args) => {
      try {
        const { session, skip = 0, first = 5, sort = '-_id' } = args;

        if (!session) {
          throw new ApolloError('必须要有评论对象');
        }

        const data = await Comment.find({
          session,
          commentTo: null,
          replyTo: null,
        })
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    replys: async (root, args) => {
      try {
        const { commentTo, skip = 0, first = 5, sort = '-_id' } = args;

        if (!commentTo) {
          throw new ApolloError('必须要有评论对象');
        }

        const data = await Comment.find({ commentTo })
          .skip(skip)
          .limit(first)
          .sort(sort);

        return data;
      } catch (error) {
        console.log(error);
      }
    },
    _commentsMeta: async (root, args) => {
      try {
        const { session } = args;
        const commentCount = await commentsCountLoader.load(session);
        const count = await commentsAndRelysCountLoader.load(session);
        return { count, commentCount };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Comment: {
    user: ({ user }) => userLoader.load(user.toString()),
    replyTo: ({ replyTo }) => replyToLoader.load(replyTo.toString()),
    replys: ({ _id }, { first = 5 }) => commentReplysLoader.load(_id.toString()),
    replyCount: ({ _id }) => replysCountLoader.load(_id.toString()),
    zanCount: ({ _id }) => zanCountLoader.load(_id.toString()),
    zanStatus: ({ _id }, _, { user }) => (user ? zanStatusLoader.load(stringify({ zanTo: _id, user })) : false),
  },
};
