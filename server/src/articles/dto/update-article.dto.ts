import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ArticleParagraphNodeDto } from './article.dto';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'First Article',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'The content of the article as rich text',
    type: [ArticleParagraphNodeDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  content?: ArticleParagraphNodeDto[];
}
