import { getUrl, getList, getPictures } from '../../../server/crawler/mzitu';

export default {
  Query: {
    mzituList: async (root, args) => {
      const { page } = args;
      const url = await getUrl({ page });
      const list = await getList(url);
      return list;
    },
    mzituPictures: async (root, args) => {
      const { url } = args;
      const data = await getPictures(url);
      return data;
    },
  },
};
