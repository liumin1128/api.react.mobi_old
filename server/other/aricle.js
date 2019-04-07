import { stringify } from 'query-string';
import fetch from 'node-fetch';
import { API_KEY } from '@/config/idataapi';

export async function getList(keyword) {
  const params = { apikey: API_KEY, kw: keyword };
  const str = stringify(params);
  const api = `http://api01.idataapi.cn:8000/article/idataapi?${str}`;
  const data = await fetch(api, { method: 'GET' }).then(res => res.json());
  if (data.data) {
    return data.data;
  }
  throw data;
}

async function test() {
  try {
    // const data = await getCategory();
  // const data = await getList();
    const data = await getList('switch');
    console.log('data');
    console.log(data);
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

// test();
