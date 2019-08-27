import Router from 'koa-router';
import { login } from './user';
import { verifyMail } from './mail';

const router = new Router();

export default router
  .post('/user/login', login)
  .get('/mail/verify', verifyMail);
