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
    content: String!
    showHtml: Boolean
    cover: String
    photos: [String]
    tags: [String]
    html: String!
    appCode: String
    appName: String
    catLabel1: String
    catLabel2: String
    url: String
    pageToken: String
  }
`;
