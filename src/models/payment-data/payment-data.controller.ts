import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { PaymentDataService } from './payment-data.service';
import { CreatePaymentDataDto } from './dto/create-payment-data.dto';
import { UpdatePaymentDataDto } from './dto/update-payment-data.dto';
import { ExtendedRequest } from '../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';

@Controller('payment-data')
@ApiTags('payment-data')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class PaymentDataController {
  constructor(private readonly paymentDataService: PaymentDataService) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Req() req: ExtendedRequest,
    @Body() createPaymentDataDto: CreatePaymentDataDto,
  ) {
    return this.paymentDataService.create(req.user.sub, createPaymentDataDto);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getMe(@Req() req: ExtendedRequest) {
    return this.paymentDataService.getMe(req.user.sub);
  }

  @Patch()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Req() req: ExtendedRequest,
    @Body() updatePaymentDataDto: UpdatePaymentDataDto,
  ) {
    return this.paymentDataService.update(req.user.sub, updatePaymentDataDto);
  }

  @HttpCode(204)
  @Delete()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest) {
    return this.paymentDataService.remove(req.user.sub);
  }
}
