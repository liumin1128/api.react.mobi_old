import Router from 'koa-router';
import work from './index';

const router = new Router();

export default router
  // .post('/daka', work.daka)
  .post('/getJsSdkConfig', work.getJsSdkConfig)
  .post('/getDakaData', work.getDakaData)
  .post('/getLeaveData', work.getLeaveData)
  .post('/getMyLeaveData', work.getMyLeaveData)
  .post('/createRule', work.createRule)
  .post('/getDakaRule', work.getDakaRule)
  .post('/getDepartment', work.getDepartment)
  .post('/getUser', work.getUser)
  .post('/approve', work.approve)
  .post('/leave', work.leave)
  .get('/mlogin', work.mlogin)
  .get('/mcallback', work.mcallback)
  .get('/pclogin', work.pclogin)
  .get('/pccallback', work.pccallback);
