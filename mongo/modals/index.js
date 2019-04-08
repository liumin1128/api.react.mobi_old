import modalCreator from './modalCreator';

import {
  userSchema,
  oauthSchema,
  articleSchema,
  saySchema,
  commentSchema,
  likeSchema,
  newsSchema,
} from '../schemas';

export const Say = modalCreator('Say', saySchema);
export const User = modalCreator('User', userSchema);
export const Oauth = modalCreator('Oauth', oauthSchema);
export const Article = modalCreator('Article', articleSchema);
export const Comment = modalCreator('Comment', commentSchema);
export const Like = modalCreator('Like', likeSchema);
export const News = modalCreator('News', newsSchema);
