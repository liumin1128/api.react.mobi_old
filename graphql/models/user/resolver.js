export default {
  Mutation: {
    userLogin: async (root, args, ctx, op) => {
      const { username, password } = args;
      // const { user } = ctx;
      // if (!user) {
      //   ctx.body = {
      //     status: 401,
      //     messge: '尚未登录',
      //   };
      //   return;
      // }
      // const { input } = args;
      // const say = await Article.create({ ...input, user });
      return {
        _id: 'sssssss',
        nickname: username,
        avatarUrl: '2323232',
        token: 'tooooooooo',
      };
    },
  },
};
