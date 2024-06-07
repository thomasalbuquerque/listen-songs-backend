import { Controller, Get } from '@nestjs/common';
import { AboutService } from './about.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';

@Controller('about')
@ApiTags('about')
@ApiHeader({ name: 'Accept-Language', enum: ['pt', 'en', 'es'] })
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('faq')
  @SkipAuth()
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getFaq() {
    return this.aboutService.getFaq();
  }

  @Get('rules')
  @ApiBearerAuth()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getRules() {
    return this.aboutService.getRules();
  }
}
