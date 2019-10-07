export default `
  type Follow {
    _id: String!
    createdAt: Date!
    user: User!
    follow: User!
  }
`;
