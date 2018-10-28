export default `
  type LikesMeta {
    count: Int!
  }
  type Like {
    _id: String!
    createdAt: Date!
    updatedAt: Date!

    article: Article!
    user: User!
    unlike: Boolean
  }
`;
