export default `
  input UserRegisterInput {
    nickname: String!
    countryCode: String!
    purePhoneNumber: String!
    code: String!
  }
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
  type UserRegisterResult {
    status: Int!
    message: String
    token: String
    userInfo: User
  }
  
`;
