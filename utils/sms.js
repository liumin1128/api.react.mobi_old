/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk');

const accessKeyId = 'yourAccessKeyId';
const secretAccessKey = 'yourAccessKeySecret';

const smsClient = new SMSClient({ accessKeyId, secretAccessKey });
// 发送短信
smsClient.sendSMS({
  PhoneNumbers: '1500000000',
  SignName: '云通信产品',
  TemplateCode: 'SMS_000000',
  TemplateParam: '{"code":"12345","product":"云通信"}',
}).then((res) => {
  const { Code } = res;
  if (Code === 'OK') {
    // 处理返回参数
    console.log(res);
  }
}, (err) => {
  console.log(err);
});
