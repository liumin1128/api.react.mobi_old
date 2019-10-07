export default `
  type NotificationMeta {
    count: Int!
  }
  type Notification {
    _id: String!
    createdAt: Date!
    user: User
    actionor: User
    type: String
    content: String
    actionShowText: String
    actionorShowText: String
    userShowText: String
  }
`;
