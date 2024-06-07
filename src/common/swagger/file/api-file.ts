import { ApiProperty } from '@nestjs/swagger';

export class ApiFile {
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: any;
}
