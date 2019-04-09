import { stringify } from 'query-string';
import moment from 'moment';
import fetch from 'node-fetch';
import { API_KEY } from '@/config/idataapi';
import { News } from '@/mongo/modals';
import { CronJob } from 'cron';
import { sleep } from '@/utils/common';

export function format(data) {
  let showHtml = false;

  // html可以直接显示的网站
  const canShowHtmlList = [
    '3dmgame.com', 'qq.com', 'duowan.com', 'eastday.com',
  ];
  if (canShowHtmlList.indexOf(data.appCode) !== -1) {
    showHtml = true;
  }
  return {
    ...data,
    showHtml,
    source: data.appName,
    date: data.publishDate,
    labels: [data.catLabel1, data.catLabel2],
    photos: data.imageUrls,
    tags: data.topkeyword,
  };
}

export function filter(data) {
  // 排除没有正文的
  if (!data.html) return false;

  // 排除微信公众号，因为图片不显示
  if (data.appCode === 'weixin') return false;

  // 排除腾讯网，已经有腾讯新闻了
  if (data.appName === '腾讯网') return false;

  // 排除垃圾
  if (data.spamLabel === '恶意推广') return false;

  // 排除国外源
  // if (data.sourceRegion !== '中国') return false;
  // 排除无图的
  if (!Array.isArray(data.imageUrls) || !data.imageUrls[0]) return false;
  return true;
}

export async function getList({ keyword: kw = 'switch', ...options }) {
  const params = {
    kw,
    apikey: API_KEY,
    sourceRegion: '中国',
    catLabel1: '游戏',
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

async function getData(args) {
  try {
    const data = await getList(args);
    console.log(`本次查到 ${data.data.length} 条数据`);

    const result = data.data
      .filter(i => filter(i))
      .map(i => format(i));

    await Promise.all(result.map(async (i) => {
      const obj = await News.findOne({ 'sourceData.id': i.id });
      if (obj) {
        console.log('已存在：', i.title);
        return;
      }
      News.create({ ...i, sourceData: i });
      console.log('已写入：', i.title);
    }));

    // if (data.hasNext && data.pageToken) {
    //   await sleep(3000);
    //   console.log(`继续查询下一页：${data.pageToken}`);
    //   getData({ ...args, pageToken: data.pageToken });
    // } else {
    //   console.log('全部数据抓取完成');
    // }
  } catch (error) {
    if (error.retcode === '100002') {
      console.log('未找到到任何文章，查询结束');
      return;
    }
    console.log('error');
    console.log(error);
  }
}


/* eslint-disable no-new */
// new CronJob('0 */10 * * * *', () => {
//   console.log(`10分钟抓取一次，${moment().format('llll')}`);
//   getData();
// }, null, true);
/* eslint-enable no-new */

const start = moment().subtract(10000, 'minute');
const end = moment();
const publishDateRange = `${start.format('X')},${end.format('X')}`;
console.log(`抓取${start.format('llll')}至今的文章`);
getData({
  keyword: 'switch',
  publishDateRange,
});
