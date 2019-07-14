export default `
  type DynamicMeta {
    count: Int!
  }
  type Dynamic {
    _id: String!
    content: String
    pictures: [String!]
    topics: [DynamicTopic]
    createdAt: String!
    user: User!
  }
  type DynamicTopic {
    _id: String!
    title: String!
    number: String!
    createdAt: String!
  }
  input DynamicInput {
    content: String!
    pictures: [String]
  }
  type CreateDynamicResult {
    status: Int!
    message: String
    data: Dynamic
  }
`;
