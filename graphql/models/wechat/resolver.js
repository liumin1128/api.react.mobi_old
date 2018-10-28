import { getUrlByName, getArticleList, getArticleDetail } from '@/server/crawler/wechat';
import { aesDecode } from '@/utils/crypto';

export default {
  Query: {
    wechat: async (root, args) => {
      const { name } = args;
      const url = await getUrlByName(name);
      const list = await getArticleList(url);
      return list;
    },
    wechatDetail: async (root, args) => {
      const { _id } = args;
      const url = aesDecode(_id);
      const data = await getArticleDetail(url);
      return data;
    },
  },
};
