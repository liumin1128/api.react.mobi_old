import { getUrl, getList, getPictures, getTags } from '../../../server/crawler/mzitu';
import { aesDecode } from '../../../utils/crypto';

export default {
  Query: {
    mzituTags: async () => {
      const tags = await getTags();
      return tags;
    },
    mzituList: async (root, args) => {
      console.log('args');
      console.log(args);
      // const { page, search, tag } = args;

      const url = await getUrl(args);
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
