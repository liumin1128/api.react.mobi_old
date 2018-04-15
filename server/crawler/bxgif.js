import cheerio from 'cheerio';
import fetch from './utils/fetch';
// import { sleep } from './utils/common';

export async function getUrl({ skip = 0 }) {
  const url = `http://tu.duowan.com/m/bxgif?offset=${skip}&order=created&math=0.7264223621601349`;
  return url;
}

export async function getList(url) {
  // 获取首页福利图列表
  // await sleep();
  console.log(`getList: ${url}`);
  const { html } = await fetch(url).then(res => res.json());
  const $ = cheerio.load(html);
  const list = [];
  function getVlue() {
    const title = $(this).find('em a').text();
    const itemUrl = $(this).find('em a').attr('href');
    const _id = itemUrl.substr(29, 6);
    const temp = $(this).find('em').text();
    const createdAt = temp.substring(title.length + 1, temp.length);
    list.push({
      _id,
      title,
      createdAt,
      url: itemUrl,
      comment: $(this).find('.fl').text(),
      cover: $(this).find('a img').attr('src'),
      total: $(this).find('.fr').text(),
    });
  }
  await $('li').map(getVlue);
  return list;
}

export async function getDetail(_id) {
  // 获取图片列表
  // await sleep();
  const url = `http://tu.duowan.com/index.php?r=show/getByGallery/&gid=${_id}&_=${moment().format('x')}`;
  console.log(`getDetail: ${url}`);
  const html = await fetch(url).then(res => res.json());
  return {
    _id,
    title: html.gallery_title,
    list: html.picInfo.map(i => ({
      title: i.add_intro,
      url: i.url,
      width: i.file_width,
      height: i.file_height,
    })),
  };
}
