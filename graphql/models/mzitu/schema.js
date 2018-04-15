export default `
  type MzituCover {
    width: String
    height: String
    src: String
  }
  type MzituList {
    title: String
    createdAt: String
    url: String
    view: String
    cover: MzituCover
  }
  type MzituPictures {
    title: String
    meta: String
    src: String
    total: String
    pictures: [String]
  }
`;
