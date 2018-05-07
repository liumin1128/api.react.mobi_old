import { createError } from 'apollo-errors';

export const throwError = (options = {}) => {
  const {
    type = 'FooError',
    message = 'A foo error has occurred',
    data = { something: 'important' },
  } = options;

  const FooError = createError(type, { message });
  throw new FooError({
    data,
    internalData: {
      error: 'The SQL server died.',
    },
  });
};
