import nodemailer from 'nodemailer';
import exqq from '@/config/exqq';
import swig from 'swig';
import path from 'path';

const transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  service: 'QQex', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: 'liumin@mail.react.mobi',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: exqq.stmp,
  },
});

const mailOptions = {
  from: '"本王今年八岁" <liumin@mail.react.mobi>', // sender address
  to: '970568830@qq.com', // list of receivers
  subject: 'Hello', // Subject line
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: '<b>Hello world?</b>', // html body
};

// // send mail with defined transport object
// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log('Message sent: %s', info.messageId);
//   // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
// });

export function sendMail(options) {
  return new Promise((resolve, reject) => {
    transporter.sendMail({ ...mailOptions, ...options }, (error, info) => {
      if (error) {
        reject(error);
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);

      resolve(info);
      // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
    });
  });
}

export function getVerifyMailTemplate(options) {
  const template = swig.compileFile(
    path.join(__dirname, './templates/verify.html'),
  );
  return template(options);
}
