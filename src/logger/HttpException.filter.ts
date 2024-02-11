import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpException } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CustomLogDto } from './dtos/custom-log-dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}
  //
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const log: CustomLogDto = {
      statusCode: status || 500,
      path: request?.url,
      timestamp: new Date(),
      message: exception?.message,
      stack: exception?.stack,
      exceptionName: exception?.name,
    };
    this.loggerService.log(log);
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
