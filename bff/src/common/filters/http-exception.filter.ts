import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import type { Response } from "express";

/** Same error shape as the ecosystem's backends:
 *  `{ success: false, statusCode, message }`. */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = "Internal server error";

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      message =
        typeof body === "string"
          ? body
          : String((body as { message?: unknown }).message ?? exception.message);
    } else {
      this.logger.error(exception);
    }

    response.status(statusCode).json({ success: false, statusCode, message });
  }
}
