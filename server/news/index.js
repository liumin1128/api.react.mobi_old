import moment from 'moment';
import { CronJob } from 'cron';
import { ENV } from '@/config/base';
import { getData } from './service';

// 今日头条，网易新闻， sohu.com的图片显示有问题，只能用文本模式

// test();
// switch,cos

// if (!ENV) {
//   /* eslint-disable no-new */
//   new CronJob(
//     '0 */60 * * * *',
//     () => {
//       const start = moment().subtract(1, 'day');
//       const end = moment();
//       const publishDateRange = `${start.format('X')},${end.format('X')}`;
//       console.log(`抓取${start.format('llll')}至今的文章`);
//       getData({
//         keyword: 'switch',
//         catLabel1: '游戏',
//         publishDateRange,
//       });
//     },
//     null,
//     true,
//   );
//   /* eslint-enable no-new */
// }
