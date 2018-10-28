import { getUrl, getList, getDetail } from '@/server/crawler/bxgif';

export default {
  Query: {
    bxgifList: async (root, args) => {
      const { skip } = args;
      const url = await getUrl({ skip });
      const list = await getList(url);

      return list;
    },
    bxgifDetail: async (root, args) => {
      const { _id } = args;
      const data = await getDetail(_id);
      return data;
    },
  },
};
