import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map(rsp => {
        if (rsp instanceof Buffer) return rsp;

        let message = 'ok'
        let code = 0;
        let data = rsp;

        if (data?.msg) message = data.msg;
        if (data?.code) code = data.code;
        if (data?.data) data = data.data;
        
        return {
          data,
          code,
          message,
        };
      }),
    );
  }
}