import cheerio from 'cheerio';
import iconv from 'iconv-lite';
import fetch from './utils/fetch';
import { sleep } from './utils/common';
import { md5Encode, md5Decode } from '../../utils/crypto';

export async function getUrl({ str = '', page = 1 }) {
  const url = `http://www.meizitu.com/a/more_${page}.html`;
  return url;
}

export async function getList(url) {
  // 获取首页福利图列表
  await sleep();
  console.log(`getList: ${url}`);
  const htmlBuffer = await fetch(url).then(res => res.buffer());
  const html = iconv.decode(htmlBuffer, 'gb2312');
  const $ = cheerio.load(html);
  const list = [];
  function getVlue() {
    const thumbnail = $(this).find('.pic img').attr('src');
    const cover = thumbnail.replace(/limg/, '01');
    const itemUrl = $(this).find('h3.tit a').attr('href');

    console.log('加密');
    console.log(md5Encode(itemUrl));
    console.log('解密');
    console.log(md5Decode(itemUrl));
    list.push({
      thumbnail,
      cover,
      _id: md5Encode(itemUrl),
      title: $(this).find('h3.tit a').text(),
      url: itemUrl,
    });
  }
  await $('.wp-list').find('li.wp-item').map(getVlue);
  return list;
}

export async function getPictures(url) {
  // 获取图片列表
  await sleep();
  console.log(`getPictures: ${url}`);
  const htmlBuffer = await fetch(url).then(res => res.buffer());
  const html = iconv.decode(htmlBuffer, 'gb2312');
  const $ = cheerio.load(html);
  const title = $('.postmeta h2 a').text();
  const meta = $('.postmeta p').text();

  const pictures = [];
  function getVlue() {
    // pictures.push({
    //   src: $(this).attr('src'),
    //   url: $(this).attr('alt'),
    // });
    pictures.push($(this).attr('src'));
  }
  await $('.postContent #picture img').map(getVlue);
  return {
    title, meta, pictures, _id: url,
  };
}

// (async () => {
//   const url = await getUrl({});
//   console.log(url);
//   const list = await getList(url);
//   console.log(list);
//   const pictures = await getPictures(list[0].url);
//   console.log(pictures);
//   // const list = await getArticleList(url);
// })();

// router.get('/', async (ctx) => {
//   ctx.body = 'Hello, I can get wechat article！';
// });

// app.use(router.routes());

// app.listen(3000);
