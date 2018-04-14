import wechatArticle from './wechatArticle';

export default `
  type Article {
    title: String!
    content: String!
    cover: String
    user: User!
    createdAt: String!
    _id: String!
  }
  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
  }
  input ArticleInput {
    title: String!
    content: String!
    cover: String
  }
  type Query {    # 定义查询内容
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article!]
    wechatArticles(first: Int, skip: Int): [{
      cover: String!
      createdAt: String!
      title: String!
      url: String!
    }]
    _articlesMeta: Meta!
    user: User!
  }
  type Mutation {
    createSay(input: SayInput): Say!
    createArticle(input: ArticleInput): Article!
  }
  ${wechatArticle}
`;
