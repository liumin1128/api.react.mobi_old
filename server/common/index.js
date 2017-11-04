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
      const key = `p${phone}c${code}`;
      const expire = 5 * 60;
      const data = await sentSMS(phone, code);
      console.log('data');
      console.log(data);
      if (data && data.Code === 'OK') {
        await setAsync(key, code, 'EX', expire);
        ctx.body = {
          status: 'ok',
          message: `验证码已发送到：${phone}, ${expire}秒有效`,
          expire,
        };
      } else {
        console.log(data);
        ctx.throw(403, '验证码发送失败');
      }
    } catch (error) {
      ctx.throw(403, '验证码发送失败');
    }
  }
  async fetch(ctx) {
    const imgUrl = await fetchToQiniu('http://wx.qlogo.cn/mmhead/Q3auHgzwzM5xTOljjQicyDtZ3uyfQpCaT79ial5KibNZiac9WnXBjFT0Sg/0');
    ctx.body = imgUrl;
  }
}

export default new CommonController();
