/**
 * 在app.use(router)之前调用
 */
/**
 * Created Date: Tuesday, September 5th 2017, 9:38:29 pm
 * Author: liumin
 * 注：在添加路由之前调用
 */
import urlFilter from './url_filter';

const responseFormatter = async (ctx, next) => {
  await next();
  if (ctx.body) {
    ctx.body = {
      data: ctx.body,
    };
  } else {
    ctx.body = {
    };
  }
};

export default pattern => urlFilter(pattern, responseFormatter);
