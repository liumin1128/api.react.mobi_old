import { Comment, Thumb } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';
import comment from '../../mongo/schemas/comment';

class CommentController {
  // 用户注册
  async create(ctx) {
    const { data } = ctx.state.user;
    const { content, id } = ctx.request.body;
    await Comment.create({
      content, id, user: data,
    });
    ctx.body = {
      status: 200,
    };
  }

  async delete(ctx) {
    try {
      const { id } = ctx.request.body;
      await Comment.remove({ _id: id });
      await Comment.remove({ id });
      await Thumb.remove({ id });
      console.log(`已删除与${id}有关的全部回复和点赞`);
      ctx.body = {
        status: 200,
      };
    } catch (error) {
      console.log('error comment delete');
      console.log(error);
    }
  }

  async reply(ctx) {
    const { data } = ctx.state.user;
    const { content, id, replyTo } = ctx.request.body;

    await Comment.create({
      content, id, replyTo, user: data,
    });

    await Comment
      .findById(replyTo)
      .update({ $inc: { replies: 1 } });

    ctx.body = {
      status: 200,
    };
  }

  async thumb(ctx) {
    const { data: user } = ctx.state.user;
    const { id } = ctx.request.body;
    if (!id) {
      ctx.body = {
        status: 403,
        message: '参数错误，无点赞对象',
      };
      return;
    }

    // 判断是否点过赞
    const thumb = await Thumb.findOne({ id, user });
    if (thumb) {
      await Thumb.remove({ id, user });
    } else {
      await Thumb.create({ id, user });
    }

    await Comment
      .findById(id)
      .update({ $inc: { likes: thumb ? -1 : 1 } });

    ctx.body = {
      status: 200,
      message: `已${thumb ? '取消赞' : '赞'}`,
    };
  }

  async list(ctx) {
    const {
      id,
      page = 0,
      pageSize = 10,
      sort = '-createdAt',
      ...other
    } = ctx.request.body;

    // const page = typeof params.page === 'number' ? params.page : 0;
    // const pageSize = typeof params.pageSize === 'number' ? params.pageSize : 10;
    // const sort = typeof params.sort === 'string' ? params.sort : '-createdAt';

    // delete params.page;
    // delete params.pageSize;
    // delete params.sort;

    const count = await Comment
      .count({ id, ...other })
      .exists('replyTo', false);

    const list = await Comment
      .find({ id, ...other })
      .exists('replyTo', false)
      .sort(sort)
      .skip((page === 0 ? page : page - 1) * pageSize)
      .limit(pageSize)
      .populate('user', POPULATE_USER);

    const temp = list.map(i => i);

    await list
      .filter(i => i.replies && i.replies > 0)
      .map(async (i) => {
        const ttt = await Comment.find({ id, replyTo: i._id });
        temp.find(t => t._id === i._id)._doc.replyList = ttt;
        console.log('temp');
        console.log(temp);
      });

    // .populate({ path: 'reply', options: { limit: 2, sort: '-createdAt' } });
    // .aggregate([{ $group: { _id: '$by_user', num_tutorial: { $sum: 1 } } }]);

    ctx.body = {
      status: 200,
      count,
      isEnd: (page === 0 ? 1 : page) * pageSize > count,
      data: temp,
    };
  }

  async detail(ctx) {
    try {
      const comment = await Comment.findById(ctx.request.body.id);
      ctx.body = {
        status: 200,
        data: comment,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new CommentController();
