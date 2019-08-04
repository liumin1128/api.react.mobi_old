import { AuthenticationError, ApolloError } from 'apollo-server';
import { getUserToken } from '@/utils/jwt';
import { sentSMS } from '@/utils/sms';
import { randomCode } from '@/utils/common';
import { setAsync, getAsync } from '@/utils/redis';
import { md5Encode } from '@/utils/crypto';
import User from '@/mongo/models/user';
import { userLoader } from '@/mongo/models/user/dataloader';

function getKey(phone, code) {
  return `purePhoneNumber=${phone}&code=${code}`;
}

function getPhone(countryCode, purePhoneNumber) {
  switch (countryCode) {
    case '+86':
      return purePhoneNumber;
    default:
      return countryCode + purePhoneNumber;
  }
}

export default {
  Query: {
    userInfo: async (root, args, ctx) => {
      const { user } = ctx;
      if (!user) {
        throw new AuthenticationError('用户未登录');
      }
      console.log('user');
      console.log(user);
      const data = await userLoader.load(user);
      console.log('data');
      console.log(data);
      if (!data) {
        throw new ApolloError('用户不存在', 403, {
          test: 'xxx',
        });
      }
      return data;
    },
  },
  Mutation: {
    userLogin: async (root, args, ctx, op) => {
      console.log('args');
      console.log(args);
      try {
        const { password, ...other } = args;
        const user = await User.findOne(other).lean();
        const pwMd5 = md5Encode(password);
        if (user && `${pwMd5}` === user.password) {
          const token = await getUserToken(user._id);
          return {
            status: 200,
            message: '登录成功',
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

    userLoginByPhonenumberCode: async (root, args, ctx, op) => {
      try {
        const { code, countryCode, purePhoneNumber } = args;

        // 校验手机验证码
        const phone = getPhone(countryCode, purePhoneNumber);
        const key = getKey(phone, code);
        const _code = await getAsync(key);
        if (code !== _code) {
          return {
            status: 401,
            message: '验证码不正确',
          };
        }

        const user = await User.findOne({
          phoneNumber: phone,
        });
        if (user) {
          const token = await getUserToken(user._id);
          return {
            status: 200,
            message: '登录成功',
            token,
            userInfo: user,
          };
        }

        return {
          status: 401,
          message: '该手机号尚未注册',
        };
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

        const { code, password, ...params } = input;

        // 校验手机验证码
        const phone = getPhone(params.countryCode, params.purePhoneNumber);
        const key = getKey(phone, code);
        const _code = await getAsync(key);
        if (code !== _code) {
          return {
            status: 401,
            message: '验证码不正确',
          };
        }

        let user;

        user = await User.findOne({
          nickname: params.nickname,
        });

        if (user) {
          return {
            status: 401,
            message: '昵称已被使用',
          };
        }

        user = await User.findOne({
          phoneNumber: phone,
        });

        if (user) {
          return {
            status: 401,
            message: '手机号已绑定',
          };
        }

        const pwMd5 = md5Encode(password);

        user = await User.create({
          ...params,
          username: phone,
          phoneNumber: phone,
          password: pwMd5,
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
            message: '参数不正确，缺少国家',
          };
        }

        if (!phone) {
          return {
            status: 401,
            message: '参数不正确，缺少手机号',
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

    updateUserInfo: async (root, args, ctx, op) => {
      try {
        const { user } = ctx;

        const { input } = args;

        console.log('updateUserInfo input');
        console.log(input);

        if (!user) {
          throw new AuthenticationError('用户未登录');
        }

        await User.updateOne({ _id: user }, input);

        return {
          status: 200,
          message: '用户信息更新成功',
        };
      } catch (error) {
        return {
          status: 500,
          message: '用户信息更新失败',
        };
      }
    },
  },
};
