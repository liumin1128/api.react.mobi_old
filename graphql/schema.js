import say from './models/say/schema';
import user from './models/user/schema';
import article from './models/article/schema';
import wechat from './models/wechat/schema';
import meizitu from './models/meizitu/schema';
import mzitu from './models/mzitu/schema';
import bxgif from './models/bxgif/schema';
import doyogif from './models/doyogif/schema';
import other from './models/other/schema';

export default `
  ${say}
  ${user}
  ${article}
  ${wechat}
  ${meizitu}
  ${mzitu}
  ${bxgif}
  ${doyogif}
  ${other}

  type Query {

    # 用户
    user: User!

    # 文章
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article!]
    _articlesMeta: ArticleMeta!

    # 说说
    say(_id: String): Say!
    says(first: Int, skip: Int): [Say!]
    _saysMeta: SayMeta!

    # 微信公众号文章
    wechat(name: String): [Wechat!]
    wechatDetail(_id: String): WechatDetail

    # 妹子图
    meizituList(page: Int): [MeizituList!]
    meizituPictures(_id: String): MeizituPictures

    # 福利图
    mzituList(page: Int, search: String, tag: String): [MzituList!]
    mzituTags: [MzituTag!]
    mzituPictures(_id: String): MzituPictures

    # 爆笑gif
    bxgifList(skip: Int): [BxgifList!]
    bxgifDetail(_id: String): BxgifDetail

    # 逗游gif
    doyogifList(skip: Int): [DoyogifList!]
    doyogifDetail(_id: String): DoyogifDetail

    # 历史上的今天
    todayInHistory(date: String): [TodayInHistory]
  }
  type Mutation {

    # 用户登录
    userLogin(username: String!, password: String!): UserLogin

    # 创建文章
    createArticle(input: ArticleInput): Article!

    # 创建说说
    createSay(input: SayInput): Say!
  }
`;
