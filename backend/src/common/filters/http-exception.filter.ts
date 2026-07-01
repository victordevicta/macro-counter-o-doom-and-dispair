import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'The darkness has claimed your request.';

    this.logger.error(
      `${request.method} ${request.url} - ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        typeof message === 'object' && 'message' in (message as object)
          ? (message as any).message
          : message,
      doom: this.getDoomQuote(status),
    });
  }

  private getDoomQuote(status: number): string {
    const quotes = {
      400: 'Your request is corrupted, mortal.',
      401: 'The gates are sealed. Authentication required.',
      403: 'You dare enter without permission? The curse grows stronger.',
      404: 'Lost in the abyss. The resource perishes.',
      429: 'Too many summons. The rift overwhelms.',
      500: 'The realm collapses. Internal despair detected.',
    };
    return quotes[status] || 'The void consumes all.';
  }
}
