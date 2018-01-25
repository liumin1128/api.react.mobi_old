import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import jwt from 'koa-jwt';
import mongoose from 'mongoose';

import Oauth from './server/oauth';
import Maps from './server/map/route';
import Work from './server/work/route';
import User from './server/users/route';
import Comment from './server/comment/route';
import Say from './server/say/route';
import Article from './server/article/route';
import Common from './server/common/route';
import WorkConatiner from './server/work';
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
    // /^\/work/,
    /^\/article\/list/,
    /^\/article\/detail/,
    /^\/say\/list/,
    /^\/say\/detail/,
    /^\/comment\/list/,
    /^\/qiniu\/token/,
    /^\/test/,
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
  .use('/user', User.routes())
  .use('/comment', Comment.routes())
  .use('/say', Say.routes())
  .use('/article', Article.routes())
  .use('/common', Common.routes())
  .post('/wechat/clockin', WorkConatiner.clockin)
  .post('/wechat/getMyDakaData', WorkConatiner.getMyDakaData)
  .post('/im/create', Im.create)
  .post('/im/update', Im.update);


app.use(router.routes());

app.listen(port, () => {
  console.log(`localhost: ${port}`);
});
