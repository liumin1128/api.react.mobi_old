import { stringify } from 'query-string';
import fetch from 'node-fetch';
import { API_KEY } from '@/config/idataapi';

export async function getList({ keyword: kw = 'switch', ...options }) {
  const params = {
    kw,
    apikey: API_KEY,
    sourceRegion: '中国',
    ...options,
  };

  const str = stringify(params);
  const api = `http://api01.idataapi.cn:8000/article/idataapi?${str}`;
  console.log('抓取综合文章：', api);
  const data = await fetch(api, { method: 'GET' }).then(res => res.json());
  if (data.retcode === '000000') {
    return data;
  }
  throw data;
}
