export default `
  type DoyogifList {
    _id: String
    title: String
    url: String
    cover: String
  }
  type DoyogifItem {
    title: String
    url: String
    width: String
    height: String
  }
  type DoyogifDetail {
    _id: String
    title: String
    list: [DoyogifItem]
  }
`;
