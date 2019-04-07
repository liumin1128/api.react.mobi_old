import user from './models/user/resolver';
import say from './models/say/resolver';
import article from './models/article/resolver';
import wechat from './models/wechat/resolver';
import meizitu from './models/meizitu/resolver';
import mzitu from './models/mzitu/resolver';
import bxgif from './models/bxgif/resolver';
import doyogif from './models/doyogif/resolver';
import other from './models/other/resolver';
import qiniu from './models/qiniu/resolver';
import comment from './models/comment/resolver';
import like from './models/like/resolver';
import scalar from './scalar';

import news from './models/news/resolver';

import { resolverCombine } from './utils';

export default resolverCombine(
  scalar,
  user,
  say,
  article,
  wechat,
  meizitu,
  mzitu,
  bxgif,
  doyogif,
  qiniu,
  other,
  comment,
  like,
  news,
);
