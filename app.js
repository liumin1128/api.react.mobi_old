import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import KoaStatic from 'koa-static';
import cors from 'koa2-cors';
import helmet from 'koa-helmet';
import { PORT } from '@/config/base';
import jwt from '@/utils/jwt';
import graphql from '@/graphql';
import router from './router';
import '@/utils/mongoose';
import '@/utils/redis';
import '@/server/recognition/tencent';


const app = new Koa();

app.use(cors());
app.use(helmet());
app.use(BodyParser({ enableTypes: ['json', 'form', 'text'] }));
app.use(KoaStatic(`${__dirname}/public`));
app.use(jwt);
app.use(router.routes());

graphql.applyMiddleware({ app });

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🎉 Graphql ready at http://localhost:${PORT}${graphql.graphqlPath}`);
});
