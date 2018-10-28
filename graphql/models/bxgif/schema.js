export default `
  type BxgifList {
    _id: String
    title: String
    createdAt: String
    url: String
    comment: String
    cover: String
    total: String
    height: Int
  }
  type BxgifItem {
    title: String
    url: String
    width: String
    height: String
  }
  type BxgifDetail {
    _id: String
    title: String
    list: [BxgifItem]
  }
`;
