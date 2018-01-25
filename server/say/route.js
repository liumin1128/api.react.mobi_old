import Router from 'koa-router';
import Say from './index';

const router = new Router();

export default router
  .post('/create', Say.create)
  .post('/list', Say.list)
  .post('/detail', Say.detail);
