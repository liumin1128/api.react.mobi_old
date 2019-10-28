const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const _ = require('lodash');

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      if (_.isString(value) && /^\d*$/.test(value)) {
        return parseInt(value, 0);
      } else if (_.isInteger(value)) {
        return value;
      }
      return new Date(value).getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(parseInt(ast.value, 10));
      }
      return null;
    },
  }),
};
