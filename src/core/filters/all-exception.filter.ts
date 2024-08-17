import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception.message
      ? exception.message
      : `${status >= 500 ? "Service Error" : "Client Error"}`;
    const errorResponse = {
      statusCode: status,
      data: null,
      message,
      code: 1,
    };
    // 设置返回的状态码、请求头、发送错误信息
    response.status(200);
    response.header("Content-Type", "application/json; charset=utf-8");
    response.send(errorResponse);

    console.log(`Request ${request.url} Failed:`, message);
  }
}
