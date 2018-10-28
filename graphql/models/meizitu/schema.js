export default `
  type MeizituList {
    _id: String
    title: String
    thumbnail: String
    url: String
    cover: String
  }
  type MeizituPictures {
    _id: String
    title: String
    meta: String
    pictures: [String]
  }
`;
