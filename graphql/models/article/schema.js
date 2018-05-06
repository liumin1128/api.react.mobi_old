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
  type ArticleType {
    tag: String!
  }
  input ArticleInput {
    title: String!
    content: String!
    cover: String
    rawData: String
    rawDataType: String
    tags: [ArticleType]
  }
`;
