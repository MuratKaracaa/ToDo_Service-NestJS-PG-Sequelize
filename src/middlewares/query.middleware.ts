import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FindAttributeOptions, FindOptions } from 'sequelize';

import { HelperFunctions } from 'src/utils/helpers';

/**
 * Requests that implement this middleware return a result in accordance with the specified query parameters.
 * if a column or more than one columns are specified in the query than only those columns will be returned, otherwise all columns in the DTO will be returned
 * if limit and offset parameters are specified then the specified pagination will be implemented
 * if order and by parameters are specified then those order operation will be conducted
 */
@Injectable()
export class QueryMiddleware implements NestMiddleware {
  helpers: HelperFunctions;
  constructor() {
    this.helpers = new HelperFunctions();
  }
  use(request: Request, response: Response, next: NextFunction) {
    const {
      column,
      limit,
      order,
      offset,
      by,
    }: {
      column?: string | Array<string>;
      limit?: string;
      order?: string | Array<string>;
      offset?: string;
      by?: string | Array<string>;
    } = request.query;

    const isNotNeedToSetOrderCriteria =
      (order === undefined || null) && (by === undefined || null);

    const orderCriterias = isNotNeedToSetOrderCriteria
      ? undefined
      : this.helpers.GetOrderCriterias(order, by);

    const options: FindOptions = this.helpers.SetFindOptions(
      limit,
      offset,
      orderCriterias,
    );

    const isOnlyOneColumnSpecified = typeof column === 'string';
    const attributes: FindAttributeOptions =
      column === null || column === undefined
        ? { include: ['*'], exclude: ['createdAt', 'updatedAt'] }
        : isOnlyOneColumnSpecified
        ? [column]
        : [...column];
    request.options = options;
    request.attributes = attributes;
    next();
  }
}
