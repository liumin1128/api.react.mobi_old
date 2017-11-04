import { getQiniuToken, fetchToQiniu } from '../../utils/qiniu';
import { sentSMS } from '../../utils/sms';
import { setAsync, getAsync } from '../../utils/redis';

class CommonController {
  // 获取七牛token
  async token(ctx) {
    ctx.body = getQiniuToken();
  }
  async verifyPhone(ctx) {
    try {
      const code = '666777';
      const { phone } = ctx.request.body;
      await setAsync(`p${phone}c${code}`, code);
      const data = await sentSMS(phone, code);
      if (data && data.Code === 'OK') {
        ctx.body = {
          status: 'ok',
          message: `验证码已发送到：${phone}`,
        };
      }
    } catch (error) {
      ctx.body = {
        status: 'ERROR',
        message: '验证码已发送失败',
      };
    }
  }
  async fetch(ctx) {
    const imgUrl = await fetchToQiniu('http://wx.qlogo.cn/mmhead/Q3auHgzwzM5xTOljjQicyDtZ3uyfQpCaT79ial5KibNZiac9WnXBjFT0Sg/0');
    ctx.body = imgUrl;
  }
}

export default new CommonController();
