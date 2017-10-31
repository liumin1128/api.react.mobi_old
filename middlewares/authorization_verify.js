/**
 * 在app.use(router)之前调用
 */
/**
 * Created Date: Tuesday, September 5th 2017, 9:38:29 pm
 * Author: liumin
 * 注：在添加路由之前调用
 */
import momont from 'moment';
import { User } from '../mongo/modals';
import { client } from '../utils/redis';

export default async (ctx, next) => {
  if (!ctx.url.match(/^\/oauth/)) {
    const { exp, data } = ctx.state.user;
    const now = momont().unix();
    if (now < exp) {
      let user = await client.getAsync(data);
      if (!user) {
        user = await User.findById(data);
        if (user) {
          console.log('用户不存在！');
          ctx.body = {
            status: 401,
            message: '用户不存在！',
          };
        }
        await client.setAsync(user._id, user);
        console.log('查询并保存');
      }
      ctx.user = user;
    } else {
      console.log('无效');
    }
  }
  await next();
};

