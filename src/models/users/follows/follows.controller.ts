import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ExtendedRequest } from '../../../common/types/request.type';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  create(
    @Req() req: ExtendedRequest,
    @Body() createFollowDto: CreateFollowDto,
  ) {
    return this.followsService.create(req.user.sub, createFollowDto);
  }

  @Get()
  findAll(@Req() req: ExtendedRequest) {
    return this.followsService.findAll(req.user.sub);
  }

  @HttpCode(204)
  @Delete(':followingId')
  remove(
    @Req() req: ExtendedRequest,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.remove(req.user.sub, followingId);
  }
}
