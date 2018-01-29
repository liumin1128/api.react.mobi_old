import Router from 'koa-router';
import work from './index';

const router = new Router();

export default router
  // .post('/daka', work.daka)
  .post('/getJsSdkConfig', work.getJsSdkConfig)
  .post('/getDakaData', work.getDakaData)
  .post('/createRule', work.createRule)
  .post('/getDakaRule', work.getDakaRule)
  .post('/getDepartment', work.getDepartment)
  .post('/getUser', work.getUser)
  .post('/approve', work.approve)
  .get('/mlogin', work.mlogin)
  .get('/mcallback', work.mcallback)
  .get('/pclogin', work.pclogin)
  .get('/pccallback', work.pccallback);
