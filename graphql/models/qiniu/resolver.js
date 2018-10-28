import { getQiniuToken } from '@/utils/qiniu';

export default {
  Query: {
    qiniuToken: async () => {
      try {
        const data = await getQiniuToken();
        return data;
      } catch (error) {
        console.log('qiniuToken error');
        console.log(error);
      }
    },
  },
};
