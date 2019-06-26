
import { News } from '@/mongo/modals';
// import { userLoader, commentCountLoader, likeCountLoader, likeStatusLoader } from '../../utils';

export default {
  Query: {
    NewsDetail: async (root, args) => {
      const { _id } = args;
      const data = await News.findById(_id);
      return data;
    },
    NewsList: async (root, args) => {
      try {
        const { skip = 0, first = 16, sort = '-createdAt' } = args;
        const data = await News
          .find({})
          .skip(skip)
          .limit(first)
          .sort(sort);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
