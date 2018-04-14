
import showapiSdk from 'showapi-sdk';
import { APPID, SECRET } from '../config/showapi';

// 开启debug
showapiSdk.debug(true);
// if (!(appId && secret)) {
//   console.error('请先设置appId等测试参数,详见样例代码内注释!');
//   return;
// }
// 全局默认设置
showapiSdk.setting({
  url: 'http://route.showapi.com/184-5', // 你要调用的API对应接入点的地址,注意需要先订购了相关套餐才能调
  appId: APPID, // 你的应用id
  secret: SECRET, // 你的密钥
  timeout: 5000, // http超时设置
  // options: {// 默认请求参数,极少用到
  //   testParam: 'test',
  // },
});

export const getCodeValue = base64 => new Promise((resolve) => {
  const request = showapiSdk.request();
  request.appendText('img_base64', base64);
  request.appendText('typeId', '34');
  request.appendText('convert_to_jpg', '0');
  request.post((data) => {
    console.info(data);
    resolve(data);
  });
});

export default showapiSdk;

