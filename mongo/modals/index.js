import modal from './modalCreator';

import {
  userSchema,
  oauthSchema,
  articleSchema,
  saySchema,
  commentSchema,
  thumbSchema,
  configSchema,
  dakaSchema,
  ruleSchema,
  leaveSchema,
} from '../schemas';

export const Say = modal('Say', saySchema);
export const User = modal('User', userSchema);
export const Oauth = modal('Oauth', oauthSchema);
export const Article = modal('Article', articleSchema);
export const Comment = modal('Comment', commentSchema);
export const Thumb = modal('Thumb', thumbSchema);
export const Config = modal('Config', configSchema);
export const Daka = modal('Daka', dakaSchema);
export const Rule = modal('Rule', ruleSchema);
export const Leave = modal('Rule', leaveSchema);
