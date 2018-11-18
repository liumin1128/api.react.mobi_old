import fetch from 'node-fetch';
import { getAuthorization } from './utils';
// 文档地址
// https://cloud.tencent.com/document/product/868/17697
const appid = '1253997281';

console.log(getAuthorization());

export function livedetectpicture(img) {
  const params = {
    appid,
    url: img,
  };
  const url = 'https://recognition.image.myqcloud.com/face/livedetectpicture';
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
      authorization: getAuthorization(),
    },
    body: JSON.stringify(params),
  })
    .then((res) => {
      return res.json();
    })
    .catch((e) => {
      console.log(e);
    });
}


// https://imgs.react.mobi/FnP6tAq3_SLrDZfBpOyOg0e7Snv1

async function test() {
  const data = await livedetectpicture('https://imgs.react.mobi/FnP6tAq3_SLrDZfBpOyOg0e7Snv1');
  console.log('data');
  console.log(data);
}

// test();
