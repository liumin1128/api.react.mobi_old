import { getUrl, getList, getDetail, getDetailUrl } from '@/server/crawler/doyogif';

export default {
  Query: {
    doyogifList: async (root, args) => {
      const { skip } = args;
      const url = await getUrl({ skip });
      const list = await getList(url);
      return list;
    },
    doyogifDetail: async (root, args) => {
      const { _id, skip } = args;
      const url = await getDetailUrl({ _id, skip });
      const data = await getDetail(url);
      return data;
    },
  },
};
