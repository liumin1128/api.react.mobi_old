import { todayInHistory } from '../../../utils/showapi';

export default {
  Query: {
    todayInHistory: async (root, { date = '1128' }) => {
      const list = await todayInHistory(date);
      console.log('list');
      console.log(list);
      return list;
    },
  },
};
