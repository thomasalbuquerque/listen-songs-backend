import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseArrayPipe,
} from '@nestjs/common';
import { Status } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiForbiddenError } from '../../common/swagger/errors/api-forbidden.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';
import { DrawProductsService } from './draw-products.service';
import { CreateDrawProductDto } from './dto/create-draw-product.dto';
import { UpdateDrawProductDto } from './dto/update-draw-product.dto';

@Controller('draw-products')
@ApiTags('draw-products')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class DrawProductsController {
  constructor(private readonly drawProductsService: DrawProductsService) {}

  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(@Body() createDrawProductDto: CreateDrawProductDto) {
    return this.drawProductsService.create(createDrawProductDto);
  }

  @Get()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  @ApiQuery({ name: 'status', enum: Status, isArray: true, required: false })
  findAll(@Query('status', ParseArrayPipe) status: Status[]) {
    return this.drawProductsService.findAll(status);
  }

  @Get(':id')
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  findOne(@Param('id') id: string) {
    return this.drawProductsService.findOne(id);
  }

  @Patch(':id')
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Param('id') id: string,
    @Body() updateDrawProductDto: UpdateDrawProductDto,
  ) {
    return this.drawProductsService.update(id, updateDrawProductDto);
  }
}
