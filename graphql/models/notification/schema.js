export default `
  type NotificationMeta {
    count: Int!
  }
  type Notification {
    _id: String!
    createdAt: String!
    user: User
    actionor: User
    content: String
    actionShowText: String
    actionorShowText: String
    userShowText: String
  }
`;
