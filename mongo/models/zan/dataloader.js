
import DataLoader from 'dataloader';
import { parse } from 'query-string';
import Zan from './index';

// 根据zanTo，拿到点赞数量
export const zanCountLoader = new DataLoader(ids => Promise.all(
  ids.map(id => Zan.countDocuments({ zanTo: id })),
));

// 根据zanTo和user，拿到点赞状态
export const zanStatusLoader = new DataLoader(list => Promise.all(
  list.map(i => Zan.findOne(parse(i))),
).then(data => data.map(i => !!i)));
