import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { StrapiPaginationDto } from './strapi-pagination.dto';

export class StrapiMetaDto {
  @ApiProperty({
    description: 'Pagination metadata',
    type: StrapiPaginationDto,
    required: false,
  })
  @IsOptional()
  pagination?: StrapiPaginationDto;
}
