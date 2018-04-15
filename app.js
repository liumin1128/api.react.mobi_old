import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import KoaStatic from 'koa-static';
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
import { graphiql, graphql } from './graphql';


const app = new Koa();
const router = new Router();

const port = process.env.NODE_ENV === 'production' ? 3101 : PORT;

console.log('LOCAL');
console.log(LOCAL);

mongoose.connect(LOCAL ? 'mongodb://localhost:27017/apiReactMobi' : 'mongodb://react:lol970568830@localhost:27000/react');
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

app.use(cors());
app.use(helmet());
app.use(error);
app.use(jwt({ secret: SECRET }).unless({
  path: [
    /^\/graphql/,
    /^\/graphiql/,
    /^\/public/,
    /^\/oauth/,
    /^\/map/,
    // /^\/work/,

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

    /^\/work\/mlogin/,
    /^\/work\/rule\/update/,
    /^\/work\/mcallback/,
    /^\/work\/getDakaData/,
    /^\/work\/getLeaveData/,
    /^\/work\/getDepartment/,
    /^\/work\/getUser/,
    /^\/work\/getRule/,
    /^\/work\/approve/,
    // /^\/work\/leave/,
    /^\/work\/createRule/,
    /^\/WW_verify_OMMAeA9wfRu6qQeW.txt/,
    /^\/favicon.ico/,
  ],
}));


// app.use(authVerify);
app.use(BodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(KoaStatic(`${__dirname}/public`));

router
  .post('/graphql', jwt({ secret: SECRET, passthrough: true }), graphql)
  .get('/graphql', graphql)
  .get('/graphiql', graphiql)
  // .use('/graphql', Graphql.routes())
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
