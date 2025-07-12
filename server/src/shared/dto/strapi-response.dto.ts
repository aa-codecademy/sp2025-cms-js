import { ApiProperty } from '@nestjs/swagger';
import { StrapiMetaDto } from './strapi-meta.dto';

export class StrapiResponseDto<T> {
  @ApiProperty({
    description: 'The response data',
  })
  data: T;

  @ApiProperty({
    description: 'Response metadata',
    type: StrapiMetaDto,
  })
  meta: StrapiMetaDto;
}
