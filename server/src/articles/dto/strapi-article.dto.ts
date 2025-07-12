import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ArticleParagraphNodeDto } from './article.dto';

export class StrapiArticleDto {
  @ApiProperty({
    description: 'The unique identifier of the article',
    example: 2,
  })
  @IsNumber()
  id: number;

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

  @ApiProperty({
    description: 'The date when the article was created',
    example: '2025-07-12T18:30:48.478Z',
  })
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  createdAt: string;

  @ApiProperty({
    description: 'The date when the article was updated',
    example: '2025-07-12T18:30:48.478Z',
  })
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  updatedAt: string;

  @ApiProperty({
    description: 'The date when the article was published',
    example: '2025-07-12T18:30:48.519Z',
  })
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  publishedAt: string;
}
