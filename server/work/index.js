import Router from 'koa-router';
import work from './server';

const router = new Router();

export default router
  .get('/mlogin', work.mlogin)
  .get('/callback', work.callback);
