import { ApolloServer } from 'apollo-server-koa';
import resolvers from './resolvers';
import typeDefs from './schema';

export default new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ ctx }) => ctx,
});
