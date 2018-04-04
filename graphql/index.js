import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const graphql = graphqlKoa({
  schema,
  // other options here
});

export const graphiql = graphiqlKoa({
  endpointURL: '/graphql',
});

