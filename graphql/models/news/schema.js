export default `
  type NewsMeta {
    count: Int!
  }
  
  type News {
    """
    文档 [API](http://example.com)!
    """
    _id: String!
    createdAt: Date!
    updatedAt: Date!
    # 标题
    title: String!
    description: String!
    cover: String
    photos: [String]
    labels: [String]
    tags: [String]
    html: String!
    source: String
    url: String
    pageToken: String
  }
`;
