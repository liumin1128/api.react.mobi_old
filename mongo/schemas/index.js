import common from './common';
import article from './article';
import comment from './comment';
import thumb from './thumb';
import oauth from './oauth';
import user from './user';
import say from './say';
import daka from './daka';

export const userSchema = { ...common, ...user };
export const oauthSchema = { ...common, ...oauth };
export const articleSchema = { ...common, ...article };
export const commentSchema = { ...common, ...comment };
export const thumbSchema = { ...common, ...thumb };
export const saySchema = { ...common, ...say };
export const dakaSchema = { ...common, ...daka };
