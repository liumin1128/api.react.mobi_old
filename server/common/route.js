import Router from 'koa-router';
import Common from './index';

const router = new Router();

export default router
  .post('/getQiniuToken', Common.token)
  .post('/verifyPhone', Common.verifyPhone)
  .post('/fetch', Common.fetch);
