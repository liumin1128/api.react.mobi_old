import say from './models/say/schema';
import user from './models/user/schema';
import article from './models/article/schema';
import wechat from './models/wechat/schema';
import meizitu from './models/meizitu/schema';
import mzitu from './models/mzitu/schema';
import bxgif from './models/bxgif/schema';
import doyogif from './models/doyogif/schema';
import other from './models/other/schema';
import qiniu from './models/qiniu/schema';
import comment from './models/comment/schema';
import like from './models/like/schema';
import news from './models/news/schema';

export default `
  scalar Date
  
  ${say}
  ${user}
  ${article}
  ${wechat}
  ${meizitu}
  ${mzitu}
  ${bxgif}
  ${doyogif}
  ${other}
  ${qiniu}
  ${comment}
  ${like}
  ${news}

  type Result {
    status: Int!
    message: String
  }

  type Query {

    # 用户
    userInfo: User!

    # 文章
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article]
    _articlesMeta: ArticleMeta!

    # 评论
    comments(first: Int, skip: Int, commentTo: String!): [Comment]
    _commentsMeta(commentTo: String!): CommentsMeta!
    comment(_id: String): Comment!

    # 喜欢
    likes(first: Int, skip: Int, user: String, unlike: Boolean): [Like]
    _likesMeta(user: String, unlike: Boolean): LikesMeta!

    # 说说
    say(_id: String): Say!
    says(first: Int, skip: Int): [Say!]
    _saysMeta: SayMeta!

    # 微信公众号文章
    wechat(name: String): [Wechat!]
    wechatDetail(_id: String): WechatDetail

    # 妹子图
    meizituList(page: Int): [MeizituList]
    meizituPictures(_id: String): MeizituPictures

    # 福利图
    mzituList(page: Int, search: String, tag: String, type: String): [Mzitu]
    mzituTags: [MzituTag!]
    mzituPictures(_id: String): MzituPictures

    # 爆笑gif
    bxgifList(skip: Int): [BxgifList!]
    bxgifDetail(_id: String): BxgifDetail

    # 逗游gif
    doyogifList(skip: Int): [DoyogifList!]
    doyogifDetail(_id: String, skip: Int): [DoyogifDetail!]

    # 历史上的今天
    todayInHistory(date: String): [TodayInHistory]

    # 七牛Token
    qiniuToken: QiniuToken

    # 新闻资讯
    NewsList(first: Int, skip: Int, keyword: String, pageToken: String): [News]
    NewsDetail: News
  }
  type Mutation {

    # 用户登录
    userLogin(username: String!, password: String!): UserLoginResult!
    userLoginByPhonenumberCode(countryCode: String!, purePhoneNumber: String!, code: String!): UserLoginResult!
    userRegister(input: UserRegisterInput): UserRegisterResult!
    getPhoneNumberCode(countryCode: String!, purePhoneNumber: String!): Result!

    # 创建文章
    createArticle(input: ArticleInput): Result!

    # 删除文章
    deleteArticle(id: String): Result!

    # 创建说说
    createSay(input: SayInput): Result!

    # 创建评论
    createComment(content: String!, commentTo: String!): Result!

    # 删除评论
    deleteComment(id: String): Result!

    # 喜欢
    like(id: String!, unlike: Boolean): Result!

  }
`;
