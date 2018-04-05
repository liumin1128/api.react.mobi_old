export default `
  type Say {
    _id: String!
    content: String!
    photos: [String!]
    createdAt: String!
    user: User!
  }
  type Article {
    title: String!
    content: String!
    cover: String
    user: User!
    createdAt: String!
    _id: String!
  }
  type Meta {
    count: Int!
  }
  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
  }
  type Query {    # 定义查询内容
    article(_id: String): Article!
    articles(first: Int, skip: Int): [Article!]
    say(_id: String): Say
    says(first: Int, skip: Int): [Say!]
    _saysMeta: Meta
    user: User
  }
  input SayInput {
    content: String!
  }
  input ArticleInput {
    title: String!
    content: String!
    cover: String
  }
  type Mutation {
    createSay(input: SayInput): Say!
    createArticle(input: ArticleInput): Article!
  }
`;
