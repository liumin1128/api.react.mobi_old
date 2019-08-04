export default `
  input UserRegisterInput {
    nickname: String!
    countryCode: String!
    purePhoneNumber: String!
    code: String!
    password: String!
  }
  input UpdateUserInfoInput {
    avatarUrl: String!
    nickname: String!
    sex: Int
    sign: String
    birthday: Date
  }
  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
  }
  type UserLoginResult {
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
