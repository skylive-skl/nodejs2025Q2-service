import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, body, query } = req;

    const start = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} | Query: ${JSON.stringify(query)} | Body: ${JSON.stringify(body)}`,
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const res = context.switchToHttp().getResponse();
        this.logger.log(
          `Response: ${method} ${url} | Status: ${res.statusCode} | Duration: ${duration}ms`,
        );
      }),
    );
  }
}
