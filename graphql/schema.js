import say from './models/say/schema';
import user from './models/user/schema';
import article from './models/article/schema';
import wechat from './models/wechat/schema';
import meizitu from './models/meizitu/schema';

export default `
  ${say}
  ${user}
  ${article}
  ${wechat}
  ${meizitu}
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

    # 妹子图
    meizituList(page: String): [MeizituList!]
    meizituPictures(url: String): MeizituPictures

  }
  type Mutation {

    # 创建文章
    createArticle(input: ArticleInput): Article!

    # 创建说说
    createSay(input: SayInput): Say!
  }
`;
