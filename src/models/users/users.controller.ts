import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { UserEntity } from './entities/user.entity';
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
import { BlockUserDto } from './dto/block-user.dto';
import { ApiForbiddenError } from '../../common/swagger/errors/api-forbidden.error';
import { I18n, I18nContext } from 'nestjs-i18n';
import { I18nTranslations } from '../../common/i18n/i18n-translations.interface';

@Controller('users')
@ApiTags('users')
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SkipAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getMe(@Req() req: ExtendedRequest) {
    return this.usersService.getMe(req.user.sub);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  update(
    @Req() req: ExtendedRequest,
    @Body() updateUserDto: UpdateUserDto,
    @I18n() i18n: I18nContext<I18nTranslations>,
  ) {
    if (updateUserDto.password && !updateUserDto.oldPassword) {
      throw new BadRequestException(
        i18n.t('user.must_provide_old_password_to_update_password'),
      );
    }
    return this.usersService.update(req.user.sub, updateUserDto);
  }

  @HttpCode(204)
  @Delete()
  @ApiBearerAuth()
  @ApiResponse({ status: 204 })
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  remove(@Req() req: ExtendedRequest) {
    return this.usersService.remove(req.user.sub);
  }

  @Patch('block/:id')
  @ApiBearerAuth()
  @ApiResponse({ status: 400, type: ApiBadRequestError })
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 403, type: ApiForbiddenError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  blockUser(@Param('id') id: string, @Body() blockUserDto: BlockUserDto) {
    return this.usersService.blockUser(id, blockUserDto);
  }
}
