import Router from 'koa-router';
import Oauth from '@/server/oauth';
import { verifyJwt } from '@/utils/jwt';
import { sleep } from '@/utils/common';
import { ENV } from '@/config/base';
import { getAuthorization } from '@/server/recognition/tencent/utils';

const router = new Router();

export default router
  .get('/', (ctx) => { ctx.body = 'hello world'; })
  .use('/', async (ctx, next) => {
    if (ENV) {
      await sleep(500);
    }
    return next();
  })
  .use('/oauth', Oauth.routes())
  .post('/recognition/token', (ctx) => { ctx.body = { token: getAuthorization() }; })
  .post('/graphql',
    verifyJwt({ passthrough: true, key: 'user' }),
    async (ctx, next) => {
      // console.log('ctx.state');
      // console.log(ctx.state);
      // 此处可以对用户做进一步处理，从redis或数据库拉取用户信息
      if (ctx.state.user && ctx.state.user.data) {
        ctx.user = ctx.state.user.data;
      }
      return next();
    });
