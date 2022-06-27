import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Specifiec that the query string is corrupted. The queries should be like the following:
 * ?order={field}
 * ?order={field}&by={ASC or DESC}
 * ?order={field}&by={ASC or DESC}&order={field}&by={ASC or DESC}
 *
 * if more than one order criteria are specified then there should be an equal amount of by specified
 */
export class OrderCriteriaSpecificationError extends HttpException {
  constructor() {
    super(
      'Either all criterias should be specified to be ascending or descending or none of them should be specified',
      HttpStatus.BAD_REQUEST,
    );
  }
}
