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

  # 用户的社区信息
  type UserCommunityInfo {
    # 关注了多少人
    follow: Int
    # 被多少人关注
    fans: Int
    # 动态数
    dynamic: Int
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

    # 关注了多少人
    follow: Int

    # 被多少人关注
    fans: Int

    # 动态数
    dynamic: Int
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
