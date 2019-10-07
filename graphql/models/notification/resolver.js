import { AuthenticationError, ApolloError } from 'apollo-server';
import Notification from '@/mongo/models/notification';
import { userLoader } from '@/mongo/models/user/dataloader';

export default {
  Query: {
    notification: async (root, args) => {
      const { _id } = args;
      const data = await Notification.findById(_id);
      return data;
    },

    notifications: async (root, args, ctx) => {
      try {
        console.log(
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        );
        const { user } = ctx;
        if (!user) return AuthenticationError({ status: 401, message: '尚未登录' });

        const { skip = 0, first = 10, sort = '-_id', unread, type } = args;

        const query = {};
        query.user = user;
        if (unread) query.unread = unread;
        if (type) query.type = type;

        const data = await Notification.find(query)
          .skip(skip)
          .limit(first)
          .sort(sort);

        console.log('data');
        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    },

    _notificationsMeta: async (root, args, ctx) => {
      try {
        const { user } = ctx;

        const data = await Notification.countDocuments({ user });
        return { count: data };
      } catch (error) {
        console.log(error);
      }
    },
  },
  Notification: {
    user: ({ user }) => userLoader.load(user.toString()),
    actionor: ({ actionor }) => userLoader.load(actionor.toString()),
  },
};
