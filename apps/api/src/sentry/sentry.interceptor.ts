import { Injectable } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { catchError, throwError } from "rxjs";

import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import type { Observable } from "rxjs";

@Injectable()
export class SentryInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        return throwError(() => error);
      }),
    );
  }
}
