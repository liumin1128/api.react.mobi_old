export default `
  type MzituCover {
    width: String
    height: String
    src: String
  }
  type Mzitu {
    _id: String
    title: String
    createdAt: Date
    url: String
    view: String
    cover: MzituCover
  }
  type MzituTag {
    _id: String
    title: String
    tag: String
    count: String
    cover: String
    type: String
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
