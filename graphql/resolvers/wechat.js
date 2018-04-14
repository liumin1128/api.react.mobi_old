import { getUrlByName, getArticleList } from '../../server/wechatCrawler';

export default {
  Query: {
    wechat: async (root, args) => {
      const url = await getUrlByName('人民日报');
      const list = await getArticleList(url);
      return list;
    },
  },
};
