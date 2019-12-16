import Router from 'koa-router';
import { login } from './user';
import { verifyMail } from './mail';
import { fetch } from './news';

const router = new Router();

export default router
  .post('/user/login', login)
  .post('/news/fetch', fetch)
  .get('/mail/verify', verifyMail);
