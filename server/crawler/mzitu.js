import cheerio from 'cheerio';
// import proxy from 'koa2-proxy';
import fetch from './utils/fetch';
// import { sleep } from './utils/common';
import { aesEncode } from '../../utils/crypto';

export async function getUrl({ search = '', page = 1, tag = '', type = '' }) {
  let url = 'http://www.mzitu.com/';
  if (search) url += `search/${encodeURIComponent(search)}/`;
  if (type) url += `${type}/`;
  if (tag) url += `tag/${tag}/`;
  if (page) url += `page/${page}/`;
  console.log('getUrl', url);
  return url;
}

export async function getList(url) {
  // 获取首页福利图列表
  // await sleep();
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
      src: `http://mzitu.react.mobi/${src.substring(21, src.length)}`,
    };
    const href = $(this).find('a').attr('href');
    const title = $(this).find('span a').text();
    const createdAt = $(this).find('.time').text();
    const view = $(this).find('.view').text();
    list.push({
      url: href, title, createdAt, view, cover, _id: aesEncode(href),
    });
  }
  await $('.postlist ul#pins').find('li').map(getVlue);
  return list;
}

export async function getPictures(url) {
  // 获取图片列表
  // await sleep();
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
    pictures.push(`http://mzitu.react.mobi/${temp + (`0${i}`).slice(-2)}.jpg`);
  }
  return {
    title, meta, src, total, temp, pictures, _id: aesEncode(url),
  };
}

export async function getTags() {
  const url = 'http://www.mzitu.com/zhuanti/';
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html);
  const list = [];
  const types = [];
  function getValue(idx) {
    const tag = $(this).find('a').attr('href').slice(25, -1);
    const title = $(this).find('a').text();
    const count = $(this).find('i').text().slice(1, -2);
    const cover = $(this).find('a img').attr('data-original');
    // const type = (types[types.findIndex(i => i.index >= idx) - 1] || {}).title;
    const type = (types.reverse().find(i => idx <= i.index) || {}).title;
    // const cover = thumbnail.replace(/limg/, '01');
    list.push({
      tag,
      title,
      count,
      cover: `http://mzitu.react.mobi/${cover.substring(21, cover.length)}`,
      type,
      _id: tag,
    });
  }
  function getTypes() {
    types.push({
      index: $(this).index(),
      title: $(this).text(),
    });
  }

  $('.postlist .tags').find('dt').map(getTypes);
  $('.postlist .tags').find('dd').map(getValue);

  // console.log('list');
  // console.log(list);
  return list;
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
