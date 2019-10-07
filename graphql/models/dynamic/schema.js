export default `
  type DynamicMeta {
    count: Int!
  }
  type Dynamic {
    _id: String!
    content: String
    iframe: String
    pictures: [String!]
    topics: [DynamicTopic]
    createdAt: Date! 
    user: User
    zanCount: Int
    zanStatus: Boolean
    commentCount: Int
  }
  type DynamicTopic {
    _id: String!
    title: String!
    number: String!
    createdAt: Date!
  }
  input DynamicInput {
    content: String!
    iframe: String
    pictures: [String]
  }
  type CreateDynamicResult {
    status: Int!
    message: String
    data: Dynamic
  }
`;
