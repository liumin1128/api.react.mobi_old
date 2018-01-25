import Router from 'koa-router';
import Comment from './index';

const router = new Router();

export default router
  .post('/create', Comment.create)
  .post('/delete', Comment.delete)
  .post('/list', Comment.list)
  .post('/detail', Comment.detail)
  .post('/thumb', Comment.thumb)
  .post('/reply', Comment.reply);
