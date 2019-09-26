import DataLoader from 'dataloader';
import { parse } from 'query-string';
import Follow from './index';

// 根据follow，拿到被关注次数
export const followCountLoader = new DataLoader(ids => Promise.all(ids.map(id => Follow.countDocuments({ follow: id }))));

// 根据followTo和user，拿到点赞状态
export const followStatusLoader = new DataLoader(list => Promise.all(list.map(i => Follow.findOne(parse(i)))).then(data => data.map(i => !!i)));
