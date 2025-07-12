import { ApiProperty } from '@nestjs/swagger';
import { ArticleDto } from './article.dto';
import { StrapiPaginationDto } from '../../shared/dto';

export class ArticlesResponseDto {
  @ApiProperty({
    description: 'Array of articles',
    type: [ArticleDto],
  })
  data: ArticleDto[];

  @ApiProperty({
    description: 'Response metadata including pagination',
    type: 'object',
    properties: {
      pagination: {
        type: 'object',
        properties: {
          page: { type: 'number', example: 1 },
          pageSize: { type: 'number', example: 10 },
          pageCount: { type: 'number', example: 5 },
          total: { type: 'number', example: 50 },
        },
      },
    },
  })
  meta: {
    pagination: StrapiPaginationDto;
  };
}
