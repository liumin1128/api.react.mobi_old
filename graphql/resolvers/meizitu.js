import { getUrl, getList, getPictures } from '../../server/crawler/meizitu';

export default {
  Query: {
    meizitu: async (root, args) => {
      const url = await getUrl({});
      console.log(url);
      const list = await getList(url);
      console.log(list);
      // const pictures = await getPictures(list[0].url);
      // console.log(pictures);
      // const list = await getArticleList(url);
      return list;
    },
  },
};
