import { AuthenticationError, ApolloError } from 'apollo-server';
import { User } from '@/mongo/modals';
import { getUserToken } from '@/utils/jwt';
import { sentSMS } from '@/utils/sms';
import { randomCode } from '@/utils/common';
import { setAsync, getAsync } from '@/utils/redis';

function getKey(phone, code) {
  return `purePhoneNumber=${phone}&code=${code}`;
}

function getPhone(countryCode, purePhoneNumber) {
  switch (countryCode) {
    case '+1': return countryCode + purePhoneNumber;
    case '+86': return purePhoneNumber;
  }
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

    userRegister: async (root, args, ctx, op) => {
      try {
        const { input } = args;

        const { code, ...params } = input;

        // 校验手机验证码
        const phone = getPhone(params.countryCode, params.purePhoneNumber);
        const key = getKey(phone, code);
        const _code = await getAsync(key);
        if (code !== _code) {
          return {
            status: 401,
            message: '验证码错误',
          };
        }

        let user;

        user = await User.findOne({ nickname: params.nickname });
        if (user) {
          return {
            status: 401,
            message: '昵称已被使用',
          };
        }

        user = await User.findOne({ phoneNumber: phone });
        if (user) {
          return {
            status: 401,
            message: '手机号已绑定',
          };
        }

        user = await User.create({
          ...params,
          phoneNumber: phone,
          avatarUrl: 'https://imgs.react.mobi/FthXc5PBp6PrhR7z9RJI6aaa46Ue',
        });

        const token = await getUserToken(user._id);

        return {
          status: 200,
          message: '注册成功',
          token,
          userInfo: user,
        };
      } catch (error) {
        console.log('error');
        console.log(error);
        return {
          status: 500,
          message: '注册失败',
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
        const key = getKey(phone, code);
        const expire = 5 * 60;
        const data = await sentSMS(phone, code);
        if (data && data.Code === 'OK') {
          await setAsync(key, code, 'EX', expire);
          return {
            status: 200,
            message: `验证码已发送到：${phone}, 5分钟内有效`,
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
