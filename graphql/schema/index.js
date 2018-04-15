import say from './say';
import user from './user';
import article from './article';
import wechat from './wechat';
import meizitu from './meizitu';

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
    meizituList(name: String): [MeizituList!]
    meizituPictures(name: String): [MeizituPictures!]

  }
  type Mutation {

    # 创建文章
    createArticle(input: ArticleInput): Article!

    # 创建说说
    createSay(input: SayInput): Say!
  }
`;
