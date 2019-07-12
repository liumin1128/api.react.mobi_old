export default `
  type DynamicMeta {
    count: Int!
  }
  type Dynamic {
    _id: String!
    content: String
    pictures: [String!]
    createdAt: String!
    user: User!
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
