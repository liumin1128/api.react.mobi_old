import Router from 'koa-router';
import work from './server';

const router = new Router();

export default router
  .post('/getJsSdkConfig', work.getJsSdkConfig)
  .get('/mlogin', work.mlogin)
  .get('/mcallback', work.mcallback)
  .get('/pclogin', work.pclogin)
  .get('/pccallback', work.pccallback);