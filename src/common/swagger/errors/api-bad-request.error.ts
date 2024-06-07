import { ApiProperty } from '@nestjs/swagger';

export class ApiBadRequestError {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: String, isArray: true })
  errors: string[];
}
