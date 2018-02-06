import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import resolvers from './resolvers';

// // Some fake data
// const books = [
//   {
//     title: "Harry Potter and the Sorcerer's stone",
//     author: 'J.K. Rowling',
//   },
//   {
//     title: 'Jurassic Park',
//     author: 'Michael Crichton',
//   },
// ];

// // The GraphQL schema in string form
// const typeDefs = `
//   type Query { books: [Book] }
//   type Book { title: String, author: String }
// `;

// // The resolvers
// const resolvers = {
//   Query: { books: () => books },
// };

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
