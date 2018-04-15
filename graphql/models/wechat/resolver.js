import { getUrlByName, getArticleList } from '../../../server/crawler/wechat';

export default {
  Query: {
    wechat: async (root, args) => {
      const { name } = args;
      const url = await getUrlByName(name);
      const list = await getArticleList(url);
      return list;
    },
  },
};
