import { createError } from 'apollo-errors';

export const throwError = (options) => {
  const {
    type = 'FooError',
    message = 'A foo error has occurred',
    data = { something: 'important' },
  } = options;
  const ErrorTemp = createError(type, { message });
  throw new ErrorTemp({ data });
};
