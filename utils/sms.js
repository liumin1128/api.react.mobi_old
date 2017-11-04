/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
import SMSClient from '@alicloud/sms-sdk';
import { ACCESS_KEY_ID, ACCESS_KEY_SECRET } from '../config/alicloud';

// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
// 初始化sms_client
const smsClient = new SMSClient({
  accessKeyId: ACCESS_KEY_ID,
  secretAccessKey: ACCESS_KEY_SECRET,
});

export const sentSMS = (phone, code) => {
  console.log(`将发送短信验证码【${code}】到：${phone}`);
  return smsClient.sendSMS({
    PhoneNumbers: phone,
    SignName: '本王今年八岁',
    TemplateCode: 'SMS_107420209',
    TemplateParam: `{"code":"${code}","product":"本王今年八岁"}`,
  }).then((res) => {
    const { Code } = res;
    if (Code === 'OK') {
      // 处理返回参数
      return res;
    }
  }, (err) => {
    console.log(err);
    throw err;
  });
};

// 发送短信

