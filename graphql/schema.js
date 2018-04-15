import say from './models/say/schema';
import user from './models/user/schema';
import article from './models/article/schema';
import wechat from './models/wechat/schema';
import meizitu from './models/meizitu/schema';
import mzitu from './models/mzitu/schema';

export default `
  ${say}
  ${user}
  ${article}
  ${wechat}
  ${meizitu}
  ${mzitu}

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

    # 色气妹子图
    mzituList(page: Int): [MzituList!]
    mzituPictures(_id: String): MzituPictures
  }
  type Mutation {

    # 创建文章
    createArticle(input: ArticleInput): Article!

    # 创建说说
    createSay(input: SayInput): Say!
  }
`;
