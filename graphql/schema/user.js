export default `
  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
  }
  type Query {    # 定义查询内容
    user: User!
  }
`;
