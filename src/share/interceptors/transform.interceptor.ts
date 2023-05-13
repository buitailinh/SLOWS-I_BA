import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonLogger } from '../services/logger/common-logger';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const logger = new CommonLogger('RESPONSE');
    const request: Request = context.switchToHttp().getRequest();
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap((data) =>
          logger.log(
            request?.method !== 'GET'
              ? `URL: ${request?.url} ${JSON.stringify(data)} ${Date.now() - now}ms`
              : `URL: ${request?.url} ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
