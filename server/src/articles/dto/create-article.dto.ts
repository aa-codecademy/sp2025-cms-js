import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { ArticleParagraphNodeDto } from './article.dto';

export class CreateArticleDto {
  @ApiProperty({
    description: 'The title of the article',
    example: 'First Article',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the article as rich text',
    type: [ArticleParagraphNodeDto],
  })
  @IsArray()
  content: ArticleParagraphNodeDto[];
}
