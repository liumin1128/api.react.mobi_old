import say from './say';
import article from './article';
import wechat from './wechat';
import { resolverCombine } from './utils';

export default resolverCombine(say, article, wechat);
