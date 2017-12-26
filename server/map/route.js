import Router from 'koa-router';
import map from './index';

const router = new Router();

export default router
  .post('/address', map.address);
