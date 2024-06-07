import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { StakePhrasesService } from './stake-phrases.service';
import { LoginDto } from './dto/login.dto';
import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiInternalServerErrorError } from '../../common/swagger/errors/api-internal-server-error.error';
import { ApiUnauthorizedError } from '../../common/swagger/errors/api-unauthorized.error';

@ApiTags('stake-phrases')
@Controller('stake-phrases')
export class StakePhrasesController {
  constructor(private readonly stakePhrasesService: StakePhrasesService) {}

  @SkipAuth()
  @Post()
  @ApiResponse({ status: 401, type: ApiUnauthorizedError })
  @ApiResponse({ status: 500, type: ApiInternalServerErrorError })
  getStakePhrase(@Body() loginDto: LoginDto) {
    return this.stakePhrasesService.getStakePhrase(loginDto);
  }
}
