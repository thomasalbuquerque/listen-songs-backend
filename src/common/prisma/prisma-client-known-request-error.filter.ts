import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientKnownRequestErrorFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception.code === 'P2002') {
      const language: string = request.headers['accept-language'] ?? 'pt';
      let errorMessage = '';
      if (language === 'pt') {
        errorMessage = `Já existe um registro com o campo '${exception.meta.target[0]}' registrado.`;
      } else if (language === 'en') {
        errorMessage = `There is already a record with the field '${exception.meta.target[0]}' registered.`;
      } else if (language === 'es') {
        errorMessage = `Ya existe un registro con el campo '${exception.meta.target[0]}' registrado.`;
      }
      return response.status(400).json({
        statusCode: 400,
        message: 'Database error.',
        errors: [errorMessage],
      });
    }

    response.status(400).json({
      statusCode: 400,
      message: 'Database error.',
      errors: [exception.message],
    });
  }
}
