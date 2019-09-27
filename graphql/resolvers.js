import user from './models/user/resolver';
import notification from './models/notification/resolver';
import dynamic from './models/dynamic/resolver';
import article from './models/article/resolver';
import wechat from './models/wechat/resolver';
import meizitu from './models/meizitu/resolver';
import mzitu from './models/mzitu/resolver';
import bxgif from './models/bxgif/resolver';
import doyogif from './models/doyogif/resolver';
import other from './models/other/resolver';
import qiniu from './models/qiniu/resolver';
import comment from './models/comment/resolver';
import zan from './models/zan/resolver';
import follow from './models/follow/resolver';
import like from './models/like/resolver';
import news from './models/news/resolver';
import scalar from './scalar';
import { resolverCombine } from './utils';

export default resolverCombine(
  scalar,
  user,
  notification,
  dynamic,
  article,
  wechat,
  meizitu,
  mzitu,
  bxgif,
  doyogif,
  qiniu,
  other,
  comment,
  zan,
  follow,
  like,
  news,
);
