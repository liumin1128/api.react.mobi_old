// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
// import { User } from '../../mongo/modals';
import { Comment } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

class CommentController {
  // 用户注册
  async create(ctx) {
    const { data } = ctx.state.user;
    const { content, id, replyTo } = ctx.request.body;
    let comment;
    if (replyTo) {
      comment = await Comment.findById({ id: replyTo });
      console.log('comment');
      console.log(comment);
    } else {
      comment = await Comment.create({
        content, id, user: data,
      });
      console.log(comment);
    }


    ctx.body = {
      status: 200,
    };
  }
  async list(ctx) {
    const params = {
      ...ctx.request.body,
    };

    const page = typeof params.page === 'number' ? params.page : 0;
    const pageSize = typeof params.pageSize === 'number' ? params.pageSize : 10;
    const sort = typeof params.sort === 'string' ? params.sort : '-createdAt';

    delete params.page;
    delete params.pageSize;
    delete params.sort;

    const count = await Comment.count(params);
    // .exists('replyTo', false);

    const list = await Comment.find(params)
      // .exists('replyTo', false)
      .skip((page === 0 ? page : page - 1) * pageSize)
      .populate('user', POPULATE_USER)
      // .populate('replyTo')
      .limit(pageSize)
      .sort(sort);

    ctx.body = {
      status: 200,
      count,
      isEnd: (page === 0 ? 1 : page) * pageSize > count,
      data: list,
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
