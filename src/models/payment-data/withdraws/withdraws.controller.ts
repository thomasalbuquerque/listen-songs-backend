import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { WithdrawsCreateService } from './withdraws-create.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { ExtendedRequest } from '../../../common/types/request.type';
import { GetTaxService } from './get-tax.service';
import { WithdrawsHistoryService } from './withdraws-history.service';
import { WithdrawsHistoryQueryDto } from './dto/withdraws-history.query.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../../common/swagger/errors/api-unauthorized.error';
import { ApiInternalServerErrorError } from '../../../common/swagger/errors/api-internal-server-error.error';
import { ApiNotFoundError } from '../../../common/swagger/errors/api-not-found.error';
import { ApiBadGatewayError } from '../../../common/swagger/errors/api-bad-gateway.error';

@Controller('payment-data/withdraws')
@Controller('withdraws')
@ApiTags('withdraws')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class WithdrawsController {
  constructor(
    private readonly withdrawsCreateService: WithdrawsCreateService,
    private readonly getTaxService: GetTaxService,
    private readonly withdrawsHistoryService: WithdrawsHistoryService,
  ) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiResponse({ status: 502, type: ApiBadGatewayError })
  create(
    @Req() req: ExtendedRequest,
    @Body() createWithdrawDto: CreateWithdrawDto,
  ) {
    return this.withdrawsCreateService.create(req.user.sub, createWithdrawDto);
  }

  @Get()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getHistory(
    @Req() req: ExtendedRequest,
    @Query(ValidationPipe) withdrawsHistoryQueryDto: WithdrawsHistoryQueryDto,
  ) {
    return this.withdrawsHistoryService.getHistory(
      req.user.sub,
      withdrawsHistoryQueryDto.limit,
      withdrawsHistoryQueryDto.offset,
    );
  }

  @Get('tax')
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiResponse({ status: 502, type: ApiBadGatewayError })
  getTax() {
    return this.getTaxService.getTax();
  }
}
