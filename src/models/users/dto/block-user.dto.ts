import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class BlockUserDto {
  @IsOptional()
  @ApiProperty()
  devSecret?: string;
}
