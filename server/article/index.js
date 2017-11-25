// import jwt from 'jsonwebtoken';
// import { SECRET } from '../../config';
// import { User } from '../../mongo/modals';
import { Article } from '../../mongo/modals';

class ArticleController {
  // 用户注册
  async create(ctx) {
    try {
      const { data } = ctx.state.user;
      const article = await Article.create({
        ...ctx.request.body,
        user: data,
      });
      ctx.body = {
        status: 200,
        article,
      };
    } catch (error) {
      console.log(error);
    }
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

    const article = await Article.find(params)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(sort);

    ctx.body = {
      data: article,
    };
  }
  async detail(ctx) {
    const article = await Article.findById(ctx.request.body.id);
    ctx.body = {
      data: article,
    };
  }
}

export default new ArticleController();
