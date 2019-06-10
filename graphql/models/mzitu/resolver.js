import { getUrl, getList, getPictures, getTags } from '@/server/crawler/mzitu';
import { aesDecode } from '@/utils/crypto';

export default {
  Query: {
    mzituTags: async () => {
      const tags = await getTags();
      return tags;
    },
    mzituList: async (root, args) => {
      const { skip, ...other } = args;
      const page = Math.ceil(skip / 24) + 1;
      const url = await getUrl({ page, ...other });
      const list = await getList(url);
      return list;
    },
    mzituPictures: async (root, args) => {
      const { _id } = args;
      const url = aesDecode(_id);
      const data = await getPictures(url);
      return data;
    },
  },
};
