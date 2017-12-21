import { request } from '../../utils/im';

class Im {
  // 用户注册
  async create(ctx) {
    const url = 'https://api.netease.im/nimserver/user/create.action';
    const params = { accid: 'liumin' };
    const data = await request(url, params);

    ctx.body = data;
  }
  async update(ctx) {
    const url = 'https://api.netease.im/nimserver/user/update.action';
    // 312143243242
    const params = { accid: 'liumin', token: 'token' };
    const data = await request(url, params);

    ctx.body = data;
  }
}

export default new Im();
