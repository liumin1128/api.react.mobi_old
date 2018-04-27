import { User } from '../../../mongo/modals';
import { getUserToken } from '../../../utils/jwt';

export default {
  Mutation: {
    userLogin: async (root, args, ctx, op) => {
      try {
        const { password, ...other } = args;
        const user = await User.findOne(other);
        console.log('user');
        console.log(user);
        if (user && `${password}` === user.password) {
          const token = await getUserToken(user._id);
          console.log('token');
          console.log(token);
          return {
            status: 200,
            token,
            userInfo: user,
          };
        } else {
          return {
            status: 403,
            message: '用户名或密码不正确',
          };
        }
      } catch (error) {
        return {
          status: 403,
          message: '登录失败',
          error,
        };
      }
    },
  },
};
