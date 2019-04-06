import { API_KEY } from '@/config/99api';
import { stringify } from 'query-string';
import fetch from '@/utils/fetch';

export async function getCategory() {
  const data = await fetch(`http://api01.6bqb.com/tencent/category?apikey=${API_KEY}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}

export async function getList() {
  const params = {
    tag: 'news_comic',
    apikey: API_KEY,
    page: 0,
  };

  const str = stringify(params);
  const data = await fetch(`http://api01.6bqb.com/toutiao/search?${str}`);
  console.log('data');
  console.log(data);

//   if (data.data) {
//     return data.data;
//   }
//   throw data;
}


getCategory();
// getList();
