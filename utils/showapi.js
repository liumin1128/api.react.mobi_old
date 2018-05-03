
import showapiSdk from 'showapi-sdk';
import moment from 'moment';

// 设置你测试用的appId和secret,img
const appId = '43048';
const secret = '6c5f90696de742bf8267a74d94805655';

// 开启debug
// showapiSdk.debug(true);
// if (!(appId && secret)) {
//   console.error('请先设置appId等测试参数,详见样例代码内注释!');
//   return;
// }
// 全局默认设置
showapiSdk.setting({
  // url: 'http://route.showapi.com/184-5', // 你要调用的API对应接入点的地址,注意需要先订购了相关套餐才能调
  appId, // 你的应用id
  secret, // 你的密钥
  timeout: 5000, // http超时设置
  // options: {// 默认请求参数,极少用到
  //   testParam: 'test',
  // },
});

export const getCodeValue = base64 => new Promise((resolve, reject) => {
  const request = showapiSdk.request('http://route.showapi.com/184-5');
  request.appendText('img_base64', base64);
  request.appendText('typeId', '34');
  request.appendText('convert_to_jpg', '0');
  request.post(({ showapi_res_body: body }) => {
    const { Result } = body;
    if (Result) {
      resolve(Result);
    } else {
      reject();
    }
  });
});

export const todayInHistory = date => new Promise((resolve, reject) => {
  const request = showapiSdk.request('http://route.showapi.com/119-42');
  request.appendText('date', date || moment().format('MMDD'));
  request.post(({ showapi_res_body: body, ...other }) => {
    if (body.ret_code === 0) {
      resolve(body.list);
    } else {
      reject(other);
    }
  });
});

export default showapiSdk;

