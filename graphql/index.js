import { ApolloServer, AuthenticationError } from 'apollo-server-koa';
import resolvers from './resolvers';
import typeDefs from './schema';

export default new ApolloServer({
  typeDefs,
  resolvers,
  // introspection: true,
  context: ({ ctx }) => ctx,
  // engine: {
  //   rewriteError(err) {
  //     // Return `null` to avoid reporting `AuthenticationError`s
  //     if (err instanceof AuthenticationError) {
  //       return null;
  //     }
  //     // All other errors will be reported.
  //     return err;
  //   },
  // },
});
