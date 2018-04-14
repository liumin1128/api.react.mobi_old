export default `
  type Wechat {
    title: String!
    createdAt: String!
    url: String!
    cover: String!
  }
  type Query {
    wechat(first: Int, skip: Int): [Wechat!]
  }
`;
