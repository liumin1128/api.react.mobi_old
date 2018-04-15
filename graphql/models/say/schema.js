export default `
  type SayMeta {
    count: Int!
  }
  type Say {
    _id: String!
    content: String!
    photos: [String!]
    createdAt: String!
    user: User!
  }
  input SayInput {
    content: String!
  }
`;
