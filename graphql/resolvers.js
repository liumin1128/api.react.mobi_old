import say from './models/say/resolver';
import article from './models/article/resolver';
import wechat from './models/wechat/resolver';
import meizitu from './models/meizitu/resolver';
import mzitu from './models/mzitu/resolver';

import { resolverCombine } from './utils';

export default resolverCombine(say, article, wechat, meizitu, mzitu);
