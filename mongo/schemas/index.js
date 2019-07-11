import common from './common';
import article from './article';
import comment from './comment';
import like from './like';
import oauth from './oauth';
import user from './user';
import dynamic from './dynamic';
import news from './news';

export const userSchema = { ...common, ...user };
export const oauthSchema = { ...common, ...oauth };
export const articleSchema = { ...common, ...article };
export const commentSchema = { ...common, ...comment };
export const likeSchema = { ...common, ...like };
export const dynamicSchema = { ...common, ...dynamic };
export const newsSchema = { ...common, ...news };
