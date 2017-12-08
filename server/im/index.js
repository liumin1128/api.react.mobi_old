import { request } from '../../utils/im';

class Im {
  // 用户注册
  async create(ctx) {
    const url = 'https://api.netease.im/nimserver/user/create.action';
    const params = { accid: '312143243242' };

    const data = await request(url, params);

    console.log('data');
    console.log(data);
    ctx.body = {
      data,
      params,
    };
  }
}

export default new Im();
