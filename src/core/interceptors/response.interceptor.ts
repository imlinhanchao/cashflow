import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response } from "express";
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((rsp) => {
        if (Buffer.isBuffer(rsp.data)) {
          // 设置适当的响应头
          response.set({
            'Content-Type': rsp.type || 'application/octet-stream',
            'Content-Disposition': rsp.filename ? `attachment; filename="${encodeURIComponent(rsp.filename)}"` : undefined,
          });
          response.send(rsp.data);
        }
        else {
          let message = "ok";
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
        }
      })
    );
  }
}
