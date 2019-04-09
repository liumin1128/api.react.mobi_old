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
];

function canShowHtml(appCode) {
  return canShowHtmlList.indexOf(appCode) !== -1;
}

const blackList = [
  'ali213.net', // 翻页有问题
  'weixin', // 图片不显示
  'yxdown.com', // 图片不显示
  'game234.com', // 内容质量过低
  'myzaker.com', // 内容质量过低
  'pcgames.com.cn', // 内容质量过低
  'yzz.cn', // 内容质量过低
  'china.com', // 分页异常
  'uuu9.com', // 图片不显示
];

// 文本模式
// 163.com

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
