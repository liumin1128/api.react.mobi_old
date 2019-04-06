import { API_KEY } from '@/config/99api';
import { stringify } from 'query-string';
import fetch from '@/utils/fetch';

export async function getCategory() {
  const data = await fetch(`http://api01.6bqb.com/toutiao/category?apikey=${API_KEY}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}

export async function getList(tag = '__all__', page = 0) {
  const params = { apikey: API_KEY, tag, page };
  const str = stringify(params);
  const data = await fetch(`http://api01.6bqb.com/toutiao/search?${str}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}

export async function getDetail(id) {
  const params = { apikey: API_KEY, itemId: id };
  const str = stringify(params);
  const data = await fetch(`http://api01.6bqb.com/toutiao/detail?${str}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}

export async function getComment(id) {
  const params = { apikey: API_KEY, itemId: id };
  const str = stringify(params);
  const data = await fetch(`http://api01.6bqb.com/toutiao/comment?${str}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}

export async function keywordSearch(keyword, pageType = 'synthesis') {
  // 综合(synthesis),资讯(information),视频(video),小视频(xiaoshipin),图片(gallery),用户(user),音乐(music),微头条(weitoutiao)
  const params = { apikey: API_KEY, keyword, pageType };
  const str = stringify(params);
  const data = await fetch(`http://api01.6bqb.com/toutiao/keyword?${str}`);
  if (data.data) {
    return data.data;
  }
  throw data;
}


async function test() {
  // const data = await getCategory();
  // const data = await getList();
  const data = await getDetail('6671553660519973383');
  console.log('data');
  console.log(data);
}

test();
