import Koa from 'koa';
import Router from 'koa-router';
import fetch from 'node-fetch';
import request from 'request';
import cheerio from 'cheerio';
import moment from 'moment';
import { sleep } from './utils';
import { getCodeValue } from '../../utils/showapi';

moment.locale('zh-cn');

const app = new Koa();
const router = new Router();


export async function getUrlByName(str) {
  console.log(`getUrlByName${str}`);
  const url = `http://weixin.sogou.com/weixin?type=1&query=${encodeURIComponent(str)}&ie=utf8&_sug_=y&_sug_type_=1`;
  const html = await fetch(url).then(res => res.text());
  if (html.indexOf('<title>302 Found</title>') !== -1) console.log('302');
  if (html.indexOf('您的访问过于频繁') !== -1) {
    console.log('访问过于频繁');
    await sleep(10000, 20000);
    await getUrlByName(str);
    return;
  }
  const $ = cheerio.load(html);
  const wechatName = $($('#sogou_vr_11002301_box_0 a')[0]).attr('href') || '';
  await sleep();
  return wechatName;
}

export async function getArticleList(url) {
  console.log(`getArticleList${url}`);
  const html = await fetch(url).then(res => res.text());
  if (html.indexOf('为了保护你的网络安全，请输入验证码') !== -1) {
  // 处理验证码
    console.log('处理验证码');
    const $ = cheerio.load(html);
    let imgUrl = `http://mp.weixin.qq.com${$('#verify_img').attr('src')}`;
    imgUrl = `http://mp.weixin.qq.com/mp/verifycode?cert=${(new Date()).getTime() + Math.random()}`;
    const cert = imgUrl.split('=')[1];
    console.log('cert');
    console.log(cert);

    const j = request.jar();
    const { cookie, base64 } = await new Promise(resolve => request
      .get({ url: imgUrl, encoding: 'base64', jar: j }, (err, response, body) => {
        resolve({ cookie: j.getCookieString(url), base64: body });
      }));

    console.log('{ cookie, base64 }');
    console.log({ cookie, base64 });

    const data = await getCodeValue(base64);
    console.log('data');
    console.log(data);


    // console.log('遇到验证码，重试');
    // await sleep();
    // await getArticleList(url);
    return;
  }

  let msglist = (html.match(/var msgList = ({.+}}]});?/) || [])[1];
  if (!msglist) {
    console.log('没找到文章列表，只支持订阅号，服务号不支持');
    console.log(html);
    return html;
  }
  msglist = msglist.replace(/(&quot;)/g, '\\\"').replace(/(&nbsp;)/g, '');
  msglist = JSON.parse(msglist);
  const list = await msglist.list.map((i) => {
    return {
      // ...i,
      cover: i.comm_msg_info.cover,
      createdAt: moment(i.comm_msg_info.datetime).format('llll'),
      title: i.app_msg_ext_info.title,
      url: `http://mp.weixin.qq.com${i.app_msg_ext_info.content_url.replace(/(amp;)|(\\)/g, '')}`,
      // other: i.app_msg_ext_info.multi_app_msg_item_list.map(o => ({
      //   title: o.title,
      //   url: `http://mp.weixin.qq.com${o.content_url.replace(/(amp;)|(\\)/g, '')}`,
      // })),
    };
  });
  return list;
}

export async function getArticleDetail(url) {
  console.log(`getArticleDetail${url}`);

  const html = await fetch(url).then(res => res.text());
  const $ = cheerio.load(html);
  const content = $($('#js_content'))
    .html()
    .replace(/<img [^>]*data-src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
      return match.replace(/data-src=['"]([^'"]+)/, `src="${capture}&tp=webp&wxfrom=5&wx_lazy=1"`);
    });
  return content;
}

// (async () => {
//   const url = await getUrlByName('人民日报');
//   const list = await getArticleList(url);
// })();

router.get('/', async (ctx) => {
  // ctx.body = 'Hello, I can get wechat article！';
  const url = await getUrlByName('人民日报');
  const list = await getArticleList(url);
  // console.log(list);

  // const detail = await getArticleDetail(list[0].url);
  ctx.body = list;
});

app.use(router.routes());

app.listen(3000);
