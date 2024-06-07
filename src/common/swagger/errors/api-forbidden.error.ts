import { ApiProperty } from '@nestjs/swagger';

export class ApiForbiddenError {
  @ApiProperty()
  message: string;

  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;
}
