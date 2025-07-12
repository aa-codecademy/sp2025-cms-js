import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class StrapiPaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  @IsNumber()
  pageSize: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  @IsNumber()
  pageCount: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 50,
  })
  @IsNumber()
  total: number;
}
