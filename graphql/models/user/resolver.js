import { AuthenticationError, ApolloError } from 'apollo-server';
import { User } from '@/mongo/modals';
import { getUserToken } from '@/utils/jwt';
import { sentSMS } from '@/utils/sms';
import { randomCode } from '@/utils/common';
import { setAsync, getAsync } from '@/utils/redis';

function getKey(phone, code) {
  return `purePhoneNumber=${phone}&code=${code}`;
}

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
            message: '登录成功',
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

    getPhoneNumberCode: async (root, args, ctx, op) => {
      try {
        const { countryCode, purePhoneNumber: phone } = args;

        if (!countryCode) {
          return {
            status: 401,
            message: '参数错误，缺少国家',
          };
        }

        if (!phone) {
          return {
            status: 401,
            message: '参数错误，缺少手机号',
          };
        }

        const code = randomCode();
        const key = getKey(phone, key);
        const expire = 5 * 60;
        const data = await sentSMS(phone, code);
        if (data && data.Code === 'OK') {
          await setAsync(key, code, 'EX', expire);
          return {
            status: 200,
            message: '发送验证码成功',
          };
        } else {
          return {
            status: 403,
            message: '验证码发送失败',
          };
        }
      } catch (error) {
        console.log('error');
        console.log(error);
        return {
          status: 403,
          message: '验证码发送失败',
        };
      }
    },
  },
};
