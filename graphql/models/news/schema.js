export default `
  type NewsMeta {
    count: Int!
  }
  
  type News {
    """
    文档 [API](http://example.com)!
    """
    id: String!
    date: Date
    # 标题
    title: String!
    description: String!
    cover: String
    photos: [String]
    labels: [String]
    tags: [String]
    html: String!
    source: String
  }
`;
