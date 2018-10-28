import { getUrl, getList, getPictures } from '@/server/crawler/meizitu';
import { aesDecode } from '@/utils/crypto';

export default {
  Query: {
    meizituList: async (root, args) => {
      const { page } = args;
      const url = await getUrl({ page });
      const list = await getList(url);
      return list;
    },
    meizituPictures: async (root, args) => {
      const { _id } = args;
      const url = aesDecode(_id);
      const data = await getPictures(url);
      return data;
    },
  },
};
