import { stringify } from 'query-string';
import moment from 'moment';
import fetch from 'node-fetch';
import { API_KEY } from '@/config/idataapi';

export function format(data) {
  return {
    ...data,
    description: data.content,
    source: data.appName,
    date: data.publishDate,
    labels: [data.catLabel1, data.catLabel2],
    photos: data.imageUrls,
    cover: data.imageUrls[0],
    tags: data.topkeyword,
  };
}

export async function getList(keyword) {
  const params = { apikey: API_KEY, kw: keyword };
  const str = stringify(params);
  const api = `http://api01.idataapi.cn:8000/article/idataapi?${str}`;
  const data = await fetch(api, { method: 'GET' }).then(res => res.json());
  if (data.data) {
    return data.data.map(i => format(i));
  }
  throw data;
}

export async function getDetail(options) {
  const params = { apikey: API_KEY, ...options };
  const str = stringify(params);
  const api = `http://api01.idataapi.cn:8000/article/idataapi?${str}`;
  const data = await fetch(api, { method: 'GET' }).then(res => res.json());
  if (data.data[0]) {
    return format(data.data[0]);
  }
  throw data;
}

async function test() {
  try {
    // const data = await getCategory();
  // const data = await getList();
    const data = await getList('switch');
    // const data = await getDetail({ id: 'a55bfba3edca4d6a3b83db59d884bebb' });
    console.log('data');
    console.log(data);
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

test();
