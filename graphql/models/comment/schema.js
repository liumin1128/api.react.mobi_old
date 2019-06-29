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
    
    replyTo: Comment
    replys: [Comment]
  }
  type CreateCommentResult {
    status: Int!
    message: String
    data: Comment
  }
`;
