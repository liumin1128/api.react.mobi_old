export default `
  type CommentsMeta {
    count: Int!
  }
  type Comment {
    _id: String!
    createdAt: Date!
    updatedAt: Date!

    session: String!
    content: String!
    user: User!

    replys(first: Int): [Comment]
    replyCount: Int
    replyTo: Comment
    commentTo: Comment
  }
  type CreateCommentResult {
    status: Int!
    message: String
    data: Comment
  }
`;
