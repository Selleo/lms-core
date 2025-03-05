import { Injectable } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import { catchError, throwError } from "rxjs";

import type { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import type { Observable } from "rxjs";

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        return throwError(() => error);
      }),
    );
  }
}
