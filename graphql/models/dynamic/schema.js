export default `
  type DynamicMeta {
    count: Int!
  }
  type Dynamic {
    _id: String!
    content: String
    photos: [String!]
    createdAt: String!
    user: User!
  }
  input DynamicInput {
    content: String!
  }
`;
