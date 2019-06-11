import cheerio from 'cheerio';
import chunk from 'lodash/chunk';
import request from 'request';
import fs from 'fs';
import { sleep } from '@/utils/common';
import { sequence } from '@/utils/promise';
import { checkPath, readFile, saveFile } from '@/utils/fs';
import fetch from './utils/fetch';

export async function getIndexUrl(number) {
  let url = 'https://www.manhuadb.com/manhua/';
  if (number) url += number;
  return url;
}

export async function getData(url) {
  // 获取首页福利图列表
  // await sleep();
  console.log(`getData: ${url}`);
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
    const href = `https://www.manhuadb.com${$(this).find('a').attr('href')}`;
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
    // creators,
    // description,
    list,
    // data,
    // detail,
  };
}

export async function getPageList(url) {
  console.log(`getPageList: ${url}`);
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html, { decodeEntities: false });
  const list = [];
  function getPage2() {
    list.push(`https://www.manhuadb.com${$(this).attr('value')}`);
  }
  await $('select.form-control').eq(0).find('option').map(getPage2);
  return list;
}

export async function getPage(url) {
//   console.log(`getPage: ${url}`);
  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html, { decodeEntities: false });

  const src = await $('img.img-fluid').attr('src');
  return `https://www.manhuadb.com${src}`;
}

async function test(number) {
//   const list = [];
  const indexUrl = await getIndexUrl(number);
  const data = await getData(indexUrl);

  data.list = data.list.slice(0, 1);

  console.log(data.list);

  await sequence(data.list.map((i, idx) => async () => {
    await sleep(Math.random() * 1000);
    const pageList = await getPageList(i.href);

    // pageList = pageList.slice(0, 5);
    console.log('pageList');
    console.log(pageList);

    const imgs = [];
    const cur = 5;
    // 分20一组，串行访问
    await sequence(chunk(pageList, cur).slice(0, 1).map(pages => async () => {
      await sleep(Math.random() * 5000);
      //   以20一组，并行访问
      await Promise.all(pages.map(async (j, jdx) => {
        let src;
        async function race() {
          await sleep(Math.random() * 1000);
          console.log(`前往url:${j}`);
          //   如果超时，重新加入队列
          const res = await Promise.race([
            getPage(j),
            sleep(5000),
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

test(128);

async function readJson() {
//   await checkPath('../jojo');
  const data = await readFile('../jojo/128.json');
  console.log('data');
  console.log(data);
  const json = JSON.parse(data);
  console.log('json');
  console.log(json.list[0].list.length);

  const ssss = [];

  const cur = 10;
  await sequence(json.list.map((list, idx) => async () => {
    await sequence(chunk(list.list, cur).map((pages, pdx) => async () => {
      await sleep(Math.random() * 1000);
      console.log('正在获取:', `/jojo/${idx + 1}/`, ` 第${pdx + 1}批`);
      await Promise.all(pages.map(async (j, jdx) => {
        const dirpath = `../jojo/${idx + 1}`;
        const filepath = `../jojo/${idx + 1}/${cur * pdx + jdx + 1}.jpg`;
        await checkPath(dirpath);
        await dp(j, filepath);

        const index = parseInt(j.substr(42, 3).replace('_', ''), 0);
        ssss.push(index);
      }));
      console.log('获取成功');
    }));
  }));

  console.log('ssss');
  console.log(JSON.stringify(ssss.sort((x, y) => x - y)));
}
// readJson();


function dp(url, filepath) {
  return new Promise((resolve, reject) => {
    // 块方式写入文件
    const wstream = fs.createWriteStream(filepath);

    wstream.on('open', () => {
      console.log('下载：', url, filepath);
    });
    wstream.on('error', (err) => {
      console.log('出错：', url, filepath);
      reject(err);
    });
    wstream.on('finish', () => {
      console.log('完成：', url, filepath);
      resolve(true);
    });

    request(url).pipe(wstream);
  });
}
