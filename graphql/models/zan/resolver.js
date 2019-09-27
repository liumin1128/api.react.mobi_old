import Zan from '@/mongo/models/zan';
import Notification from '@/mongo/models/notification';
import Comment from '@/mongo/models/comment';

async function CreateNotification({ _id, actionor }) {
  try {
    let content;
    let user;

    const comment = await Comment.findById(_id);
    if (!comment) return;

    user = comment.user;
    content = comment.content;

    if (user === actionor) return;

    await Notification.create({
      user,
      actionor,
      type: 'zan',
      userShowText: content,
    });
  } catch (error) {
    console.log(error);
  }
}

export default {
  Mutation: {
    zan: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;
        if (!user) return { status: 403, message: '尚未登录' };

        const { _id } = args;
        if (!_id) return { status: 401, message: '参数异常' };

        const zan = await Zan.findOne({ zanTo: _id, user });
        if (zan) {
          await zan.remove();
          return { status: 201, message: '已取消赞' };
        }

        await Zan.create({ zanTo: _id, user });

        CreateNotification({ _id, actionor: user });

        return { status: 200, message: '点赞成功' };
      } catch (error) {
        console.log('error');
        console.log(error);
      }
    },
  },
};
