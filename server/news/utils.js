const canShowHtmlList = [
  '3dmgame.com',
  'qq.com',
  'duowan.com',
  'eastday.com',
  'ikanchai.com',
  'ifeng.com',
  'doyo.cn',
];

function canShowHtml(appCode) {
  return canShowHtmlList.indexOf(appCode) !== -1;
}

const blackList = [
  'weixin',
  'game234.com',
  'myzaker.com',
  'pcgames.com.cn',
];

function isInBlackList(appCode) {
  return blackList.indexOf(appCode) !== -1;
}

export function format(data) {
  return {
    ...data,
    date: data.publishDate,
    labels: [data.catLabel1, data.catLabel2],
    photos: data.imageUrls,
    tags: data.topkeyword,
    showHtml: canShowHtml(data.appCode),

  };
}

export function filter(data) {
  // 排除没有正文的
  if (!data.html) return false;

  // 排除微信公众号，因为图片不显示
  if (data.appCode === 'weixin') return false;

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