import { stringify } from 'query-string';
import fetch from 'node-fetch';
import { API_KEY } from '@/config/idataapi';
import uniqBy from 'lodash/uniqBy';
import reverse from 'lodash/reverse';
import { News } from '@/mongo/modals';
import { format, filter, pictureToQiniu } from './utils';
import { sleep } from '@/utils/common';
import { fetchToQiniu } from '@/utils/qiniu';

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

export async function getData(args) {
  try {
    const data = await getList(args);
    console.log(`本次查到 ${data.data.length} 条数据`);

    const result = uniqBy(reverse(data.data), 'title')
    // const result = data.data
      .filter(i => filter(i))
      .map(i => format(i));

    // const result2 = await pictureToQiniu(result);

    await Promise.all(result.map(async (i) => {
      const obj = await News.findOne({ $or: [
        { 'sourceData.id': i.id },
        { 'sourceData.title': i.title },
      ] });
      // const obj = await News.findOne({ 'sourceData.id': i.id });
      if (obj) {
        console.log('已存在：', i.title);
        return;
      }
      // 抓图片
      const photos = await Promise.all(i.photos.map(j => fetchToQiniu(j)));
      // 抓封面
      let { cover, html } = i;
      if (cover) { cover = await fetchToQiniu(cover); }
      // 替换html中的图片
      i.photos.map((j, idx) => {
        html = html.replace(new RegExp(j, 'g'), photos[idx]);
      });
      // 修复今日头条图片不显示的问题
      if (i.appCode === 'toutiao.com') {
        photos.map((j) => {
          html = html.replace(/<div class="pgc-img"(([\s\S])*?)<\/div>/i, `<figure><img src="${j}" alt=""/></figure>`);
        });
      }

      News.create({ ...i, cover, html, photos, sourceData: i });

      console.log('已写入：', i.title);
    }));


    if (data.hasNext && data.pageToken) {
      await sleep(3000);
      console.log(`继续查询下一页：${data.pageToken}`);
      getData({ ...args, pageToken: data.pageToken });
    } else {
      console.log('全部数据抓取完成');
    }
  } catch (error) {
    if (error.retcode === '100002') {
      console.log('未找到到任何文章，查询结束');
      return;
    }
    console.log('error');
    console.log(error);
  }
}
