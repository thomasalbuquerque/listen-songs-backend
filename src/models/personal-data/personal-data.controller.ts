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
import { PersonalDataService } from './personal-data.service';
import { CreatePersonalDataDto } from './dto/create-personal-data.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';
import { ExtendedRequest } from '../../common/types/request.type';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiBadRequestError } from '../../common/swagger/errors/api-bad-request.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';
import { ApiNotFoundError } from '../../common/swagger/errors/api-not-found.error';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';

@Controller('personal-data')
@ApiTags('personal-data')
@ApiBearerAuth()
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class PersonalDataController {
  constructor(private readonly personalDataService: PersonalDataService) {}

  @Post()
  @ApiOperation({ summary: 'Create personal data' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(
    @Req() req: ExtendedRequest,
    @Body() createPersonalDataDto: CreatePersonalDataDto,
  ) {
    return this.personalDataService.create(req.user.sub, createPersonalDataDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get personal data' })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getMe(@Req() req: ExtendedRequest) {
    return this.personalDataService.getMe(req.user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update personal data' })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 404, type: ApiNotFoundError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Req() req: ExtendedRequest,
    @Body() updatePersonalDataDto: UpdatePersonalDataDto,
  ) {
    return this.personalDataService.update(req.user.sub, updatePersonalDataDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  @ApiOperation({ summary: 'Remove personal data' })
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest) {
    return this.personalDataService.remove(req.user.sub);
  }
}
