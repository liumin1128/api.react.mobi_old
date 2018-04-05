import Router from 'koa-router';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const graphql = graphqlKoa((ctx) => {
  const { user = {} } = ctx.state;
  console.log('user');
  console.log(user);
  return {
    schema,
    context: {
      // test: 'xxxxx',
      user: user.data,
      ...ctx,
    },
  };
});

export const graphiql = graphiqlKoa({
  endpointURL: '/graphql',
});
