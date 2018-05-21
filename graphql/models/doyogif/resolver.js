import { getUrl, getList, getDetail, getDetailUrl } from '../../../server/crawler/doyogif';

export default {
  Query: {
    doyogifList: async (root, args) => {
      const { skip } = args;
      const url = await getUrl({ skip });
      const list = await getList(url);
      return list;
    },
    doyogifDetail: async (root, args) => {
      const { _id } = args;
      const data = await getDetail(_id);
      return data;
    },
  },
};
