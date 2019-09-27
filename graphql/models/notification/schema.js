export default `
  type NotificationMeta {
    count: Int!
  }
  type Notification {
    _id: String!
    createdAt: String!
    user: User
    actionor: User
    type: String
    content: String
    actionShowText: String
    actionorShowText: String
    userShowText: String
  }
`;
