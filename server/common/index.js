import { getQiniuToken, fetchToQiniu } from '../../utils/qiniu';

class QiniuController {
  // 获取七牛token
  async token(ctx) {
    ctx.body = getQiniuToken();
  }
  async fetch(ctx) {
    const imgUrl = await fetchToQiniu('http://wx.qlogo.cn/mmhead/Q3auHgzwzM5xTOljjQicyDtZ3uyfQpCaT79ial5KibNZiac9WnXBjFT0Sg/0');
    ctx.body = imgUrl;
  }
}

export default new QiniuController();
