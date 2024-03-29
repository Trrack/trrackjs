import { ValueLike, getValue } from './valueLike';

type ErrorMessage = string;
type ErrorMessageLike = ValueLike<ErrorMessage>;

export function invariant(
  condition: boolean,
  error: ErrorMessageLike = 'Invariant failed.',
  productionError: ErrorMessageLike = 'Something went wrong.'
): asserts condition {
  if (condition) {
    return;
  }

  const isProduction = process.env['NODE_ENV'] === 'production';

  if (isProduction) {
    throw new Error(getValue(productionError));
  }

  throw new Error(getValue(error));
}
