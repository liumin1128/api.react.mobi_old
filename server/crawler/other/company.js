import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import moment from 'moment';
import xlsx from 'node-xlsx';
import fs from 'fs';
import fetch from 'node-fetch';

export async function getUrl(page = 0) {
//   const url = `http://www.neeq.com.cn/nqxxController/nqxx.do?callback=aaaaaaaaa&page=${page}&typejb=T&xxzqdm=&xxzrlx=&xxhyzl=&xxssdq=%25E4%25BA%2591%25E5%258D%2597%25E7%259C%2581&sortfield=xxzqdm&sorttype=asc&dicXxzbqs=&xxfcbj=&_=1543225902338`;
  const url = `http://www.neeq.com.cn/nqxxController/nqxx.do?callback=aaaaaaaaa&page=${page}&typejb=T&xxzqdm=&xxzrlx=&xxhyzl=&xxssdq=&sortfield=xxzqdm&sorttype=asc&dicXxzbqs=&xxfcbj=&_=1543231989489`;
  return url;
}

export async function getList(url) {
  // await sleep();
  try {
    let data = await fetch(url, { method: 'GET' })
      .then((res) => {
        return res.text();
      });
    data = data.replace('aaaaaaaaa', '');
    data = data.replace('([', '');
    data = data.replace('])', '');
    data = JSON.parse(data);
    return data.content;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

export async function getDetail(id = '430472') {
  // await sleep();
  try {
    const url = `http://www.neeq.com.cn/nqhqController/detailCompany.do?callback=aaaaaaaaa&zqdm=${id}&_=1543227451435`;
    // console.log(`getDetail: ${url}`);
    let data = await fetch(url, { method: 'GET' })
      .then((res) => {
        return res.text();
      });
    data = data.replace('aaaaaaaaa', '');
    data = data.replace(/\(/g, '');
    data = data.replace(/\)/g, '');
    data = JSON.parse(data);
    return data;
  } catch (error) {
    console.log('error');
    console.log(error);
  }
}

function getEecutives(list) {
  const temp = list.slice(0, 3)
    .map(j => ([j.name, j.job]));
  return flattenDeep(temp);
}

async function getDataOnePage(page = 0) {
  const url = await getUrl(page);
  // console.log('url');
  // console.log(url);
  const list = await getList(url);
  // console.log('list');
  // console.log(list);
  const details = await Promise.all(list.map(i => getDetail(i.xxzqdm)));
  //   console.log('details');
  //   console.log(details[1]);
  // const data = [[1, 2, 3], [4, 5, 6]];
  const data = details.map(i => [
    i.baseinfo.shortname,
    i.baseinfo.name,
    i.baseinfo.area, // 省
    i.baseinfo.totalStockEquity, // 规模
    i.baseinfo.industry, // 行业
    i.baseinfo.legalRepresentative, // 法人
    i.baseinfo.phone, // 联系电话
    i.baseinfo.email, // 邮箱
    i.baseinfo.address, // 行业
    i.baseinfo.postcode, // 行业
    i.baseinfo.broker, // 行业
    ...Array.isArray(i.executives) ? getEecutives(i.executives.slice(0, 3)) : [],
    // ...i.executives
    //   .slice(0, 3)
    //   .map(j => ([j.name, j.job])),
  ]);
  //   console.log('data');
  //   console.log(data[0]);
  // const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 3 } }; // A1:A4
  // const option = { '!merges': [range] };

  return data;
}

// getDataOnePage();

async function getDataMultiPage(page = 100) {
  const timer1 = moment().format('x');
  let data = await Promise.all(new Array(page).fill('x').map((_, idx) => getDataOnePage(idx)));
  data = flatten(data);
  //   console.log('data');
  //   console.log(data[99]);
  const timer2 = moment().format('x');
  console.log(`一共用了:${timer2 - timer1}毫秒`);
  const buffer = xlsx.build([{ name: 'mySheetName', data }]); // Returns a buffer
  fs.writeFileSync('./a.xlsx', buffer);
}

getDataMultiPage(541);
