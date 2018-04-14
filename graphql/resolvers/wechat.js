import { getUrlByName, getArticleList } from '../../server/wechatCrawler';

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
