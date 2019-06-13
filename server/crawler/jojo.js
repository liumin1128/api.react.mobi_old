import cheerio from 'cheerio';
import chunk from 'lodash/chunk';
import fs from 'fs';
import { sleep } from '@/utils/common';
import { sequence } from '@/utils/promise';
import { checkPath, readFile, downloadFile } from '@/utils/fs';
import fetch from './utils/fetch';

const baseUrl = 'https://www.manhuadb.com';

// 根据编号获取url地址
export async function getIndexUrl(number) {
  let url = `${baseUrl}/manhua/`;
  if (number) url += number;
  return url;
}

// 获取漫画基本信息和章节目录
export async function getData(url) {
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html, { decodeEntities: false });

  //   获取title
  const title = await $('h1.comic-title').text();

  //   获取简介
  const description = await $('p.comic_story').text();

  //   获取creators
  const creators = [];
  function getCreators() {
    creators.push($(this).find('a').text());
  }
  await $('.creators').find('li').map(getCreators);

  //   获取卷
  const list = [];
  function getVlue() {
    const href = `${baseUrl}${$(this).find('a').attr('href')}`;
    list.push({
      href,
    });
  }
  await $('.active .links-of-books.num_div').find('li.sort_div').map(getVlue);

  //  获取数据
  const data = [];
  function getComicData() {
    const key = $(this).find('td').attr('class') || $(this).find('td a').attr('class');
    const value = key === 'comic-cover' ? $(this).find('td img').attr('src') : $(this).find('td').text();
    const label = $(this).find('th').text();
    data.push({
      key,
      label,
      value,
    });
  }
  await $('.table.table-striped.comic-meta-data-table').find('tr').map(getComicData);

  const detail = await $('article.comic-detail-section').html();

  return {
    title,
    creators,
    description,
    list,
    data,
    detail,
  };
}

// 获取章节内全部页
export async function getPageList(url) {
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html, { decodeEntities: false });
  const list = [];
  function getPage2() {
    list.push(`${baseUrl}${$(this).attr('value')}`);
  }
  await $('select.form-control').eq(0).find('option').map(getPage2);
  return list;
}

// 获取页内图片地址
export async function getPage(url) {
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html, { decodeEntities: false });
  const src = await $('img.img-fluid').attr('src');
  return `${baseUrl}${src}`;
}

async function test(number) {
//   const list = [];
  const indexUrl = await getIndexUrl(number);
  const data = await getData(indexUrl);

  // data.list = [data.list[16]];

  console.log(data.list);

  await sequence(data.list.map((i, idx) => async () => {
    await sleep(Math.random() * 1000);
    let pageList = await getPageList(i.href);

    pageList = pageList
      .map(src => ({ src, index: parseInt(src.substr(42, 3).replace('_', ''), 0) }))
      .sort((x, y) => x.index - y.index)
      .map(({ src }) => src);

    const imgs = [];
    const cur = 20;

    // 分20一组，串行访问
    await sequence(chunk(pageList, cur).map((pages, pdx) => async () => {
      await sleep(Math.random() * 5000);
      // 以20一组，并行访问
      await Promise.all(pages.map(async (j, jdx) => {
        let src;
        async function race() {
          await sleep(Math.random() * 1000);
          console.log(`前往url:${j}`);
          // 如果超时，重新加入队列
          const res = await Promise.race([
            getPage(j),
            sleep(60000),
          ]);

          if (res) {
            src = res;
            console.log(`拿到src: ${src}`);
          } else {
            console.log('重新加入队列');
            await race();
          }
        }
        await race();

        // const dirpath = `../jojo/${idx + 1}`;
        // const filepath = `../jojo/${idx + 1}/${cur * pdx + jdx + 1}.jpg`;
        // await checkPath(dirpath);
        // await downloadFile(j, filepath);

        // const name = `${(idx + 1)}_${(jdx + 1)}.jpg`;
        //   list.push({ src, name });
        imgs.push(src);
        //   console.log(`拿到src: ${src}`);
        //   await request(img).pipe(fs.createWriteStream(`./jojo/${idx}_${jdx}.jpg`));
      }));
    }));

    data.list[idx].list = imgs
      .map(src => ({ src, index: parseInt(src.substr(42, 3).replace('_', ''), 0) }))
      .sort((x, y) => x.index - y.index)
      .map(({ src }) => src);
  }));

  console.log('爬取成功！！！');

  fs.writeFileSync(`../jojo/${number}.json`, JSON.stringify(data));
}

// test(147);

async function readJson() {
//   await checkPath('../jojo');
  const data = await readFile('../jojo/147.json');
  const json = JSON.parse(data);
  console.log(json.list[0].list.length);

  const cur = 50;
  await sequence(json.list.map((list, idx) => async () => {
    const dirpath = `../jojo/${idx + 1}`;
    await checkPath(dirpath);
    await sequence(chunk(list.list, cur).map((pages, pdx) => async () => {
      await sleep(Math.random() * 1000);
      console.log('正在获取:', `/jojo/${idx + 1}/`, ` 第${pdx + 1}批`);
      await Promise.all(pages.map(async (j, jdx) => {
        const filepath = `../jojo/${idx + 1}/${cur * pdx + jdx + 1}.jpg`;
        async function race() {
          await sleep(Math.random() * 1000);
          const res = await Promise.race([
            downloadFile(j, filepath),
            sleep(60000),
          ]);
          if (res) {
            // console.log('下载成功');
          } else {
            console.log('重新加入队列');
            await race();
          }
        }
        await race();
      }));
    }));
  }));
  console.log('获取成功');
}
// readJson();
