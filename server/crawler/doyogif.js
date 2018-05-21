import cheerio from 'cheerio';
import fetch from './utils/fetch';

export async function getUrl({ skip = 0 }) {
  const page = Math.floor(skip / 20) + 1;
  let url = 'http://www.doyo.cn/news/jiongtu?prop=10&';
  if (page) url += `p=${page}`;
  return url;
}

export async function getList(url) {
  // 获取首页福利图列表
  // await sleep();
  console.log(`getList: ${url}`);
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html);
  const list = [];

  function getVlue() {
    const href = `http://www.doyo.cn${$(this).find('a').attr('href')}`;
    const _id = $(this).find('a').attr('href').replace('/article/', '');
    const title = $(this).find('a').attr('title').replace(/内(\S*)：/, '');
    const cover = $(this).find('a img').attr('src');

    list.push({
      _id, url: href, cover, title,
    });
  }
  await $('#article_list .content').find('.item').map(getVlue);
  return list;
}

export async function getDetailUrl({ skip = 0, _id }) {
  const page = Math.floor(skip / 5) + 1;
  return `http://www.doyo.cn/article/${_id}?p=${page}`;
}

export async function getDetail(url) {
  // 获取图片列表
  // await sleep();
  console.log(`getDetail: ${url}`);
  const html = await fetch(url).then(res => res.text());
  // console.log('html');
  // console.log(html);
  const $ = cheerio.load(html);
  // const title = $('#article_title').text();
  // const createdAt = $('#article_title #pubtime_baidu').text();
  const pictures = [];
  function getValue() {
    const src = $(this).attr('src');
    const title = $(this).parent().next('p').text()
      .replace('\n', '')
      .replace('\t', '')
      .replace('\n', '');

    if (title) {
      pictures.push({
        src, title,
      });
    }
  }
  $('#article_content p img').map(getValue);
  return pictures.slice(0, 5);
}
