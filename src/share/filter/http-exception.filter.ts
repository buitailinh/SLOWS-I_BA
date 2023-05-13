import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ILog } from '../services/logger/log.interface';
import { CommonLogger } from '../services/logger/common-logger';
import { ERROR } from '../common/error-code.const';

@Catch(NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new CommonLogger('HttpExceptionFilter');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message || ERROR.COMMON_SYSTEM_ERROR.MESSAGE;

    if (status == HttpStatus.INTERNAL_SERVER_ERROR) {
      const thisLog: ILog = {
        endpoint: request.path,
        ipAddress: request.headers['x-forwarded-for'] || request.connection.remoteAddress,
        method: request.method,
        error: exception,
      };
      const urlMessage = `URL: ${request.path}, MESSAGE: ${message}`;
      this.logger.customError(urlMessage, exception.stack, thisLog);
    }

    if (exception instanceof HttpException) {
      this.logger.log(JSON.stringify(exception.getResponse()));
    }
    response.status(status).json({
      message: status == HttpStatus.INTERNAL_SERVER_ERROR ? ERROR.COMMON_SYSTEM_ERROR.MESSAGE : message,
      code:
        exception instanceof HttpException && exception.getResponse()['code']
          ? exception.getResponse()['code']
          : ERROR.COMMON_SYSTEM_ERROR.CODE,
      errors: exception instanceof HttpException ? exception.getResponse()['errors'] : undefined,
      statusCode: status,
      status: false
    });
  }
}
