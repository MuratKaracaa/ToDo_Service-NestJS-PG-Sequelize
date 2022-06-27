import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * A global controller exception filter that returns a simple
 * {
 *  statuscode,
    timestamp,
    path,
    message,
    errors
 * }
  *  response
 */
@Catch()
export class ControllerExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message ? exception.message : '',
      errors: exception.errors?.map(({ message, type, value }) => ({
        message,
        type,
        value,
      })),
    });
  }
}
