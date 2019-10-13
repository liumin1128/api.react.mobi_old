import News from '@/mongo/models/news';
// import {  commentCountLoader, likeCountLoader, likeStatusLoader } from '../../utils';
// import { userLoader } from '@/mongo/models/user/dataloader';

export default {
  Query: {
    NewsDetail: async (root, args) => {
      const { _id } = args;
      const data = await News.findById(_id);
      return data;
    },
    NewsList: async (root, args) => {
      try {
        const { skip = 0, first = 16, sort = '-_id' } = args;
        const data = await News.find({})
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
