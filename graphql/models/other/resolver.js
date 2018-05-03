import { todayInHistory } from '../../../utils/showapi';
import { randomString } from '../../../utils/common';

export default {
  Query: {
    todayInHistory: async (root, { date }) => {
      const list = await todayInHistory(date);
      return list.map(i => ({ ...i, _id: randomString() }));
    },
  },
};
