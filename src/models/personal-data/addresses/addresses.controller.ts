import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ExtendedRequest } from '../../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../../common/swagger/errors/api-unauthorized.error';
import { ApiInternalServerErrorError } from '../../../common/swagger/errors/api-internal-server-error.error';
import { ApiNotFoundError } from '../../../common/swagger/errors/api-not-found.error';

@Controller('personal-data/addresses')
@ApiTags('addresses')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Create address' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Req() req: ExtendedRequest,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    return this.addressesService.create(req.user?.sub, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get address' })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getMe(@Req() req: ExtendedRequest) {
    return this.addressesService.getMe(req.user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Req() req: ExtendedRequest,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.sub, updateAddressDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Remove address' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest) {
    return this.addressesService.remove(req.user.sub);
  }
}
