import Router from 'koa-router';
import jwt from 'koa-jwt';
import { graphql } from './index';
import { SECRET } from '../config';

const router = new Router();

export default router
  .use(jwt({ secret: SECRET, passthrough: true }))
  .post('/', graphql);
