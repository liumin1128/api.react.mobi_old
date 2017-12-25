import Router from 'koa-router';
import google from './index';

const router = new Router();

export default router
  .post('/address', google.address);
