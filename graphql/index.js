import Router from 'koa-router';
import jwt from 'koa-jwt';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';
import { SECRET } from '../config';

// Put together a schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const router = new Router();

// export const graphql = graphqlKoa({
//   schema,
//   // other options here
// });

export const graphql = graphqlKoa((ctx) => {
  return {
    schema,
    context: {
      test: 'test123',
      ctx,
    },
  };
});

export const graphiql = graphiqlKoa({
  endpointURL: '/graphql',
});


export default router
  .use(jwt({ secret: SECRET, passthrough: true }))
  .post('/', graphql);

