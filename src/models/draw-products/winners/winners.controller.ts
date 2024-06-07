import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { WinnersService } from './winners.service';
import { CreateWinnerDto } from './dto/create-winner.dto';
import { UpdateWinnerDto } from './dto/update-winner.dto';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../../common/swagger/errors/api-not-found.error';

@Controller('draw-products')
@ApiTags('draw-products-winners')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class WinnersController {
  constructor(private readonly winnersService: WinnersService) {}

  @Post(':id/winners/:userId')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() createWinnerDto: CreateWinnerDto,
  ) {
    return this.winnersService.create(id, userId, createWinnerDto);
  }

  @Patch(':id/winners/:userId')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateWinnerDto: UpdateWinnerDto,
  ) {
    return this.winnersService.update(id, userId, updateWinnerDto);
  }

  @Get(':id/winners')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findAll(@Param('id') id: string) {
    return this.winnersService.findAll(id);
  }
}
