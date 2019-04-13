import moment from 'moment';
import { CronJob } from 'cron';
import { getData } from './service';

// 今日头条，网易新闻， sohu.com的图片显示有问题，只能用文本模式

function test() {
  const start = moment().subtract(5, 'day');
  const end = moment();
  const publishDateRange = `${start.format('X')},${end.format('X')}`;
  console.log(`抓取${start.format('llll')}至今的文章`);
  getData({
    keyword: 'switch',
    catLabel1: '游戏',
    // catLabel1: '动漫',
    // publishDateRange,
  });
}


test();

// switch,cos

/* eslint-disable no-new */
new CronJob('0 */10 * * * *', () => {
  console.log(`10分钟抓取一次，${moment().format('llll')}`);
  const start = moment().subtract(10, 'minute');
  const end = moment();
  const publishDateRange = `${start.format('X')},${end.format('X')}`;
  console.log(`抓取${start.format('llll')}至今的文章`);
  getData({
    keyword: 'switch',
    catLabel1: '游戏',
    publishDateRange,
  });
}, null, true);
/* eslint-enable no-new */
