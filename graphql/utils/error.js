import { createError } from 'apollo-errors';

export const NewError = ({ type = 'error', message = 'xxx error' }) => createError(type, { message });

export default ({ message = '一个未定义的错误', err }) => {
  throw new NewError();
};
