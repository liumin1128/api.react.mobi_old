export default `
  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
  }
  type UserLogin {
    status: Int!
    token: String
    message: String
    userInfo: User
  }
`;
