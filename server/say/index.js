import { Say } from '../../mongo/modals';
import { POPULATE_USER } from '../../constants';

class SayController {
  // 用户注册
  async create(ctx) {
    const { data } = ctx.state.user;
    const say = await Say.create({
      ...ctx.request.body,
      user: data,
    });
    ctx.body = {
      status: 200,
      say,
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

    const count = await Say.count(params);

    console.log('--------count========================================================');
    console.log(count);

    const list = await Say.find(params)
      .skip((page === 0 ? page : page - 1) * pageSize)
      .populate('user', POPULATE_USER)
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
    const say = await Say
      .findById(ctx.request.body.id)
      .populate('user', POPULATE_USER);

    ctx.body = {
      status: 200,
      data: say,
    };
  }
}

export default new SayController();
