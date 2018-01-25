import Router from 'koa-router';
import Article from './index';

const router = new Router();

export default router
  .post('/create', Article.create)
  .post('/list', Article.list)
  .post('/detail', Article.detail);
