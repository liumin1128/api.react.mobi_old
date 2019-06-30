import modalCreator from './modalCreator';

import {
  userSchema,
  oauthSchema,
  articleSchema,
  saySchema,
  // commentSchema,
  likeSchema,
  newsSchema,
} from '../schemas';

// import { commentReplysLoader, replysCountLoader } from '../dataloader';

export const Say = modalCreator('Say', saySchema);
export const User = modalCreator('User', userSchema);
export const Oauth = modalCreator('Oauth', oauthSchema);
export const Article = modalCreator('Article', articleSchema);
export const Like = modalCreator('Like', likeSchema);
export const News = modalCreator('News', newsSchema);

// export const Comment = modalCreator('Comment', commentSchema, (schema) => {
//   function refreshDataloader(next) {
//     // 刷新回复及、回复数
//     if (this.commentTo) {
//       const key = this.commentTo.toString();
//       commentReplysLoader.clear(key);
//       replysCountLoader.clear(key);
//     }
//     // 甚至可以使用prime来扩充存缓，但风险较大
//     next();
//   }
//   schema.pre('save', refreshDataloader);
//   schema.pre('delete', refreshDataloader);
// });
