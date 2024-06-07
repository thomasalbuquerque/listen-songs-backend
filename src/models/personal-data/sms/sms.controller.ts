import { Controller, Post, Body, Req, HttpCode } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CreateSmsDto } from './dto/create-sms.dto';
import { ExtendedRequest } from '../../../common/types/request.type';
import { ValidateSmsDto } from './dto/validate-sms.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../../common/swagger/errors/api-bad-request.error';
import { ApiNotFoundError } from '../../../common/swagger/errors/api-not-found.error';
import { ApiUnauthorizedError } from '../../../common/swagger/errors/api-unauthorized.error';
import { ApiBadGatewayError } from '../../../common/swagger/errors/api-bad-gateway.error';

@Controller('sms')
@ApiTags('sms')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('send')
  @ApiOperation({ summary: 'Send sms' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiResponse({ status: 502, type: ApiBadGatewayError })
  send(@Req() req: ExtendedRequest, @Body() createSmsDto: CreateSmsDto) {
    const language: string = req.headers['accept-language'];
    return this.smsService.send(req.user.sub, language, createSmsDto);
  }

  @Post('resend')
  @ApiOperation({ summary: 'Resend sms' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiResponse({ status: 502, type: ApiBadGatewayError })
  resend(@Req() req: ExtendedRequest, @Body() createSmDto: CreateSmsDto) {
    const language: string = req.headers['accept-language'];
    return this.smsService.resend(req.user.sub, language, createSmDto);
  }

  @HttpCode(204)
  @Post('validate')
  @ApiOperation({ summary: 'Validate sms' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  validate(
    @Req() req: ExtendedRequest,
    @Body() validateSmsDto: ValidateSmsDto,
  ) {
    return this.smsService.validate(req.user.sub, validateSmsDto);
  }
}
