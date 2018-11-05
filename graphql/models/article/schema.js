export default `
  type ArticleMeta {
    count: Int!
  }
  type Article {
    _id: String!
    createdAt: Date!
    updatedAt: Date!

    # 标题
    title: String!
    """
    文档 [API](http://example.com)!
    """
    html: String!
    json: String!
    cover: String
    user: User!
    
    commentCount: Int
    likeCount: Int
    likeStatus: String
    description: String
  }
  input ArticleInput {
    title: String!
    html: String!
    json: String!
    tags: [String]
    description: String
    cover: String

    _id: String
  }
`;
