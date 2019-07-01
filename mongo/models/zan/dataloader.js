
import DataLoader from 'dataloader';
import Zan from './index';

// 根据session，拿到评论和回复合计数量
export const zanCountLoader = new DataLoader(ids => Promise.all(
  ids.map(id => Zan.countDocuments({ zanTo: id })),
));
