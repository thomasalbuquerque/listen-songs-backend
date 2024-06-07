import { PartialType } from '@nestjs/swagger';
import { CreatePersonalDataDto } from './create-personal-data.dto';

export class UpdatePersonalDataDto extends PartialType(CreatePersonalDataDto) {}
