import { fetchToQiniu } from '@/utils/qiniu';

const canShowHtmlList = [
  // 知名网站
  '3dmgame.com',
  'qq.com',
  'duowan.com',
  'eastday.com',
  'ifeng.com',
  'doyo.cn',
  // 其他
  'ikanchai.com',
  'pcpop.com',
  'vrtuoluo.cn',
  'gao7.com',
  '37txt.cn',
];

function canShowHtml(appCode) {
  return canShowHtmlList.indexOf(appCode) !== -1;
}

const blackList = [
  'ali213.net', // 翻页有问题
  'weixin', // 图片不显示
  'weixinpro',
  'yxdown.com', // 图片不显示
  'game234.com', // 内容质量过低
  'myzaker.com', // 内容质量过低
  'pcgames.com.cn', // 内容质量过低
  'yzz.cn', // 内容质量过低
  'china.com', // 分页异常
  // 'gamersky.com', // 分页异常
  'uuu9.com', // 图片不显示
  'e23.cn',
  'quxiu.com',
  'erhainews.com',
  'ledanji.com', // 内容质量过低
];

// 文本模式
// 163.com,toutiao.com,

function isInBlackList(appCode) {
  return blackList.indexOf(appCode) !== -1;
}

export function format(data) {
  return {
    ...data,
    date: data.publishDate,
    photos: data.imageUrls,
    tags: data.topkeyword,
    showHtml: canShowHtml(data.appCode),
  };
}

export async function getNews(i) {
  // 抓图片
  const photos = await Promise.all(i.photos.map(j => fetchToQiniu(j)));
  // 抓封面
  let { cover, html } = i;
  if (cover) { cover = await fetchToQiniu(cover); }
  // 替换html中的图片
  i.photos.map((j, idx) => {
    html = html.replace(new RegExp(j, 'g'), photos[idx]);
  });
  // 修复今日头条图片不显示的问题
  if (i.appCode === 'toutiao.com') {
    if (html.indexOf('<div class="pgc-img"') !== -1) {
      photos.map((j) => {
        html = html.replace(/<div class="pgc-img"(([\s\S])*?)<\/div>/i, `<figure><img src="${j}" alt=""/></figure>`);
      });
    } else {
      photos.map((j) => {
        html = html.replace(/<a class="image"(([\s\S])*?)<\/a>/i, `<figure><img src="${j}" alt=""/></figure>`);
      });
    }
  }
  return { ...i, cover, html, photos, sourceData: i };
}

export async function pictureToQiniu(data) {
  const temp = await Promise.all(data.map(async (i) => {
    const photos = await Promise.all(i.photos.map(j => fetchToQiniu(j)));
    return { ...i, photos };
  }));
  return temp;
}

export function filter(data) {
  // 排除腾讯网，已经有腾讯新闻了
  if (data.appName === '腾讯网') return false;

  // 排除垃圾
  if (data.spamLabel === '恶意推广') return false;

  if (isInBlackList(data.appCode)) return false;

  // 排除国外源
  // if (data.sourceRegion !== '中国') return false;
  // 排除无图的
  if (!Array.isArray(data.imageUrls) || !data.imageUrls[0]) return false;
  return true;
}
