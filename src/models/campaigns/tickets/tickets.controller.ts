import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  HttpCode,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketsDto } from './dto/create-tickets.dto';
import { ExtendedRequest } from '../../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../../common/swagger/errors/api-not-found.error';
import { ApiInternalServerErrorError } from '../../../common/swagger/errors/api-internal-server-error.error';

@Controller('campaigns')
@ApiTags('campaigns-tickets')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @HttpCode(204)
  @Post(':id/tickets')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Param('id') id: string,
    @Req() req: ExtendedRequest,
    @Body() createTicketsDto: CreateTicketsDto,
  ) {
    return this.ticketsService.create(id, req.user.sub, createTicketsDto);
  }

  @Get(':id/tickets')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll(@Param('id') id: string, @Req() req: ExtendedRequest) {
    return this.ticketsService.findAll(id, req.user.sub);
  }

  @Get(':id/tickets/price')
  @ApiResponse({ status: 200, type: String })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getTicketPriceToken(@Param('id') id: string) {
    return this.ticketsService.getTicketPriceToken(id);
  }
}
