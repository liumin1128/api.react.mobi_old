export default `
  type CommentsMeta {
    count: Int!
  }
  type Comment {
    _id: String!
    createdAt: Date!
    updatedAt: Date!

    commentTo: String!
    content: String!
    user: User!
    replyTo: String
  }
  type CreateCommentResult {
    status: Int!
    message: String
    data: Comment
  }
`;
