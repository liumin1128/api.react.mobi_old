/**
 * Created Date: Tuesday, September 5th 2017, 9:38:29 pm
 * Author: liumin
 * 注：在添加路由之前调用
 */

export default (pattern, cb) => {
  return async (ctx, next) => {
    const reg = new RegExp(pattern);
    await next();
    if (reg.test(ctx.originalUrl)) {
      cb(ctx);
    }
  };
};
