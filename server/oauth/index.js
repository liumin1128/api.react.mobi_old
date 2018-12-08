import Router from 'koa-router';
import github from './github';
import wechat from './wechat';
import outlook from './outlook';

const router = new Router();

export default router
  .get('/github', github.login)
  .get('/github/callback', github.callback)
  .get('/wechat', wechat.login)
  .get('/wechat/callback', wechat.callback)
  .get('/outlook', outlook.login)
  .get('/outlook/callback', outlook.callback);
