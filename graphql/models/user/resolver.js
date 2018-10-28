import { AuthenticationError, ApolloError } from 'apollo-server';
import { User } from '@/mongo/modals';
import { getUserToken } from '@/utils/jwt';

export default {
  Query: {
    userInfo: async (root, args, ctx) => {
      const { user } = ctx;
      if (!user) {
        throw new AuthenticationError('用户未登录');
      }
      const data = await User.findById(user);
      if (!data) {
        throw new ApolloError('用户不存在', 403, { test: 'xxx' });
      }
      return data;
    },
  },
  Mutation: {
    userLogin: async (root, args, ctx, op) => {
      try {
        const { password, ...other } = args;
        const user = await User.findOne(other).lean();
        if (user && `${password}` === user.password) {
          const token = await getUserToken(user._id);
          return {
            status: 200,
            message: '登录成功！',
            token,
            userInfo: { ...user, _id: `${user._id}` },
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
