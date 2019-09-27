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
        const { user } = ctx;
        if (!user) return { status: 401, message: '尚未登录' };

        const { skip = 0, first = 10, sort = '-_id' } = args;

        const data = await Notification.find({ user })
          .skip(skip)
          .limit(first)
          .sort(sort);

        console.log('Notification');
        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    },

    _notificationsMeta: async (root, args) => {
      try {
        const data = await Notification.countDocuments();
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
