import modal from './modalCreator';

import {
  userSchema,
  oauthSchema,
  articleSchema,
  saySchema,
  commentSchema,
  thumbSchema,
  dakaSchema,
} from '../schemas';

export const Say = modal('Say', saySchema);
export const User = modal('User', userSchema);
export const Oauth = modal('Oauth', oauthSchema);
export const Article = modal('Article', articleSchema);
export const Comment = modal('Comment', commentSchema);
export const Thumb = modal('Thumb', thumbSchema);
export const Daka = modal('Daka', dakaSchema);
