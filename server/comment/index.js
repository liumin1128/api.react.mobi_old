// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
// import { User } from '../../mongo/modals';
import { Comment } from '../../mongo/modals';

class CommentController {
  // 用户注册
  async create(ctx) {
    const { data } = ctx.state.user;
    const { content, id } = ctx.request.body;
    console.log(content);
    const comment = await Comment.create({
      content,
      id,
      user: data,
    });
    ctx.body = comment;
  }
  async list(ctx) {
    const params = {
      ...ctx.request.body,
    };

    const page = typeof params.page === 'number' ? params.page : 0;
    const pageSize = typeof params.pageSize === 'number' ? params.pageSize : 5;
    const sort = typeof params.sort === 'string' ? params.sort : '-created';

    delete params.page;
    delete params.pageSize;
    delete params.sort;

    const comment = await Comment.find(params)
      .skip(page * pageSize)
      .limit(pageSize)
      .populate('user')
      .sort(sort);

    ctx.body = {
      data: comment,
    };
  }
  async detail(ctx) {
    const comment = await Comment.findById(ctx.request.body.id);
    ctx.body = {
      data: comment,
    };
  }
}

export default new CommentController();
