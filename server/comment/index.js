// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
// import { User } from '../../mongo/modals';
import { Comment } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

class CommentController {
  // 用户注册
  async create(ctx) {
    const { data } = ctx.state.user;
    const { content, id } = ctx.request.body;
    const comment = await Comment.create({ content, id, user: data });

    ctx.body = {
      status: 200,
      data: comment,
    };
  }
  async list(ctx) {
    const params = {
      ...ctx.request.body,
    };

    const page = typeof params.page === 'number' ? params.page : 0;
    const pageSize = typeof params.pageSize === 'number' ? params.pageSize : 5;
    const sort = typeof params.sort === 'string' ? params.sort : '-createdAt';

    delete params.page;
    delete params.pageSize;
    delete params.sort;

    const comment = await Comment.find(params)
      .skip(page * pageSize)
      .limit(pageSize)
      .populate('user', POPULATE_USER)
      .sort(sort);

    ctx.body = {
      status: 200,
      data: comment,
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
