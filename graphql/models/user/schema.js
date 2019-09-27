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

  input UpdateUserPasswordInput {
    oldPassword: String
    password: String!
  }

  type UserOauth {
    from: String!
    data: String
    userInfo: String
  }

  type User {
    _id: String!
    nickname: String!
    avatarUrl: String!
    sex: Int
    sign: String
    birthday: Date
    email: String
    unverified_email: String
    countryCode: String 
    purePhoneNumber: String 
    phoneNumber: String 
    oauths: [UserOauth]
    followStatus: Boolean
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
