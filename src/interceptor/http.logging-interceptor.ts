import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, query, body } = request;

    const requestTime = Date.now();
    const correlationId =
      request.header('X-Correlation-Id') || request.header('x-correlation-id');
    const server = request.header('host');

    const requestLogContent = {
      server,
      correlationId,
    };

    const apiVersion = request.header('api-version');

    this.logger.log(
      requestLogContent,
      `[Req] ${method} ${originalUrl} v${apiVersion}`,
    );

    return next.handle().pipe(
      tap(() =>
        // 응답 성공 로그
        this.logger.log(
          {
            ...requestLogContent,
            latency: `${Date.now() - requestTime}ms`,
            statusCode: context.switchToHttp().getResponse().statusCode,
          },
          `[Res] ${method} ${originalUrl} v${apiVersion}`,
        ),
      ),
      catchError((err) =>
        // 응답 실패 로그
        throwError(() => {
          const errStatusCode: number = err.statusCode || err.status;
          if (errStatusCode < 500) {
            // 400 error는 warn
            this.logger.warn(
              {
                ...requestLogContent,
                latency: `${Date.now() - requestTime}ms`,
                statusCode: errStatusCode,
                query,
                body,
                stack: `${err.response ? err.response.message : err}`,
              },
              `[Res] ${method} ${originalUrl} v${apiVersion}`,
            );
          } else {
            // 500 error는 error
            this.logger.error(
              {
                ...requestLogContent,
                latency: `${Date.now() - requestTime}ms`,
                statusCode: errStatusCode,
                query,
                body,
              },
              `${err.response ? err.response.message : err}`,
              `[Res] ${method} ${originalUrl} v${apiVersion}`,
            );
          }
          throw err;
        }),
      ),
    );
  }
}
