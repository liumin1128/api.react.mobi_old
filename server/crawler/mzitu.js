import cheerio from 'cheerio';
// import proxy from 'koa2-proxy';
import fetch from './utils/fetch';
import { sleep } from './utils/common';

export async function getUrl({ str = '', page = 1 }) {
  const url = `http://www.mzitu.com/page/${page}/`;
  return url;
}

export async function getList(url) {
  // 获取首页福利图列表
  await sleep();
  console.log(`getList: ${url}`);
  const html = await fetch(url).then(res => res.text());
  // console.log('html');
  // console.log(html);
  const $ = cheerio.load(html);
  const list = [];
  function getVlue() {
    const src = $(this).find('a img').attr('data-original');
    const cover = {
      width: $(this).find('a img').attr('width'),
      height: $(this).find('a img').attr('height'),
      src: `/mzitu/${src.substring(21, src.length)}`,
    };
    const href = $(this).find('a').attr('href');
    const title = $(this).find('span a').text();
    const createdAt = $(this).find('.time').text();
    const view = $(this).find('.view').text();
    list.push({
      url: href, title, createdAt, view, cover,
    });
  }
  await $('.postlist ul#pins').find('li').map(getVlue);
  return list;
}

export async function getPictures(url) {
  // 获取图片列表
  await sleep();
  console.log(`getPictures: ${url}`);
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html);
  const title = $('.main-title').text();
  const meta = $('.main-meta').text();
  const src = $('.main-image p img').attr('src');
  const temp = src.substring(21, src.length - 6);
  const total = $('.pagenavi a').eq(-2).text();
  const pictures = [];
  for (let i = 1; i <= total; i += 1) {
    pictures.push(`/mzitu/${temp + (`0${i}`).slice(-2)}.jpg`);
  }
  return {
    title, meta, src, total, temp, pictures,
  };
}

// (async () => {
//   const url = await getUrl({});
//   console.log(url);
//   const list = await getList(url);
//   console.log(list);
//   const pictures = await getPictures(list[0].url);
//   console.log(pictures);
// })();

// 转发请求到指定host
// proxy.when('/mzitu', (ctx) => {
//   console.log('ctx.request');
//   console.log(ctx.request);
//   ctx.request.url = `${ctx.request.url.substring(8)}`;
//   ctx.request.host = 'i.mzitu.net';
//   ctx.request.header.referer = 'http://www.mzitu.com/';
// });

// proxy.listen(3030);
