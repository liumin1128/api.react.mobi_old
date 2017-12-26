import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import mongoose from 'mongoose';

import User from './server/users';
import Article from './server/article';
import Say from './server/say';
import Comment from './server/comment';
import Common from './server/common';
import Oauth from './server/oauth';
import Maps from './server/map/route';
import Work from './server/work/route';
import Im from './server/im';
import { PORT, DEV, LOCAL, SECRET } from './config';
import error from './middlewares/error_back';

const app = new Koa();
const router = new Router();

const port = process.env.NODE_ENV === 'production' ? 3101 : PORT;

console.log('LOCAL');
console.log(LOCAL);

mongoose.connect(LOCAL ? 'mongodb://localhost:27017/apiReactMobi' : 'mongodb://react:lol970568830@localhost:27000/react', {
  useMongoClient: true,
});
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.use(cors());
app.use(helmet());
app.use(error);
app.use(jwt({ secret: SECRET }).unless({
  path: [
    /^\/public/,
    /^\/oauth/,
    /^\/map/,
    /^\/work/,
    /^\/article\/list/,
    /^\/article\/detail/,
    /^\/say\/list/,
    /^\/comment\/list/,
    /^\/say\/detail/,
    /^\/qiniu\/token/,
    /^\/user\/login/,
    /^\/user\/register/,
    /^\/common\/verifyPhone/,
    /^\/common\/getQiniuToken/,
    /^\/im\/create/,
    /^\/im\/update/,
  ],
}));
// app.use(authVerify);
app.use(BodyParser({ enableTypes: ['json', 'form', 'text'] }));


router
  .use('/oauth', Oauth.routes())
  .use('/work', Work.routes())
  .use('/map', Maps.routes())
  .post('/im/create', Im.create)
  .post('/im/update', Im.update)
  .post('/user/login', User.login)
  .post('/user/register', User.register)
  .post('/user/getUserInfo', User.getUserInfo)
  .post('/test', User.register)
  .post('/article/create', Article.create)
  .post('/article/list', Article.list)
  .post('/article/detail', Article.detail)
  .post('/comment/create', Comment.create)
  .post('/comment/delete', Comment.delete)
  .post('/comment/list', Comment.list)
  .post('/comment/detail', Comment.detail)
  .post('/comment/thumb', Comment.thumb)
  .post('/comment/reply', Comment.reply)
  .post('/say/create', Say.create)
  .post('/say/list', Say.list)
  .post('/say/detail', Say.detail)
  .post('/common/getQiniuToken', Common.token)
  .post('/common/verifyPhone', Common.verifyPhone)
  .post('/common/fetch', Common.fetch);

app.use(router.routes());

app.listen(port, () => {
  console.log(`localhost: ${port}`);
});
