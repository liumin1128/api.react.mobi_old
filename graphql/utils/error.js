import { createError } from 'apollo-errors';

export const NewError = ({ type = 'error', message = 'xxx error' }) =>
  createError(type, { message });

export default (options = {}) => {
  const { type, message } = options;
  throw new NewError({ type, message });
};
