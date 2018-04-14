export default `
  type ArticleMeta {
    count: Int!
  }
  type Article {
    title: String!
    content: String!
    cover: String
    user: User!
    createdAt: String!
    _id: String!
  }
  input ArticleInput {
    title: String!
    content: String!
    cover: String
  }
  type Query {    # 定义查询内容
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article!]
    _articlesMeta: ArticleMeta!
  }
  type Mutation {
    createArticle(input: ArticleInput): Article!
  }
`;
