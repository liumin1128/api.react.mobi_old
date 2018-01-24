import Router from 'koa-router';
import User from './index';

const router = new Router();

export default router
  .post('/login', User.login)
  .post('/register', User.register)
  .post('/getUserInfo', User.getUserInfo);
