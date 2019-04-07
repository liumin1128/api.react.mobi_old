
import { getDetail, getList } from '@/server/other/aricle';
// import { userLoader, commentCountLoader, likeCountLoader, likeStatusLoader } from '../../utils';

export default {
  Query: {
    NewsDetail: async (root, args) => {
      const { id } = args;
      const data = await getDetail(id);
      return data;
    },
    NewsList: async (root, args) => {
      try {
        const data = await getList('switch');
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
