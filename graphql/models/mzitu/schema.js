export default `
  type MzituCover {
    width: String
    height: String
    src: String
  }
  type MzituList {
    _id: String
    title: String
    createdAt: String
    url: String
    view: String
    cover: MzituCover
  }
  type MzituPictures {
    _id: String
    title: String
    meta: String
    src: String
    total: String
    pictures: [String]
  }
`;
