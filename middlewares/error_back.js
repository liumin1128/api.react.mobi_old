/**
 * 在app.use(router)之前调用
 */
/**
 * Created Date: Tuesday, September 5th 2017, 9:38:29 pm
 * Author: liumin
 * 注：在添加路由之前调用
 */

export default (ctx, next) => {
  return next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = {
        status: 401,
      };
    } else {
      throw err;
    }
  });
};

