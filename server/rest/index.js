import Router from 'koa-router';
import { login } from './user';

const router = new Router();

export default router.post('/user/login', login);
