import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class ArticleTextNodeDto {
  @ApiProperty({
    description: 'The text content',
    example: 'Some random text for the first article',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'The type of the text node',
    example: 'text',
  })
  @IsString()
  type: string;
}

export class ArticleParagraphNodeDto {
  @ApiProperty({
    description: 'The type of the paragraph node',
    example: 'paragraph',
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The children nodes of the paragraph',
    type: [ArticleTextNodeDto],
  })
  @IsArray()
  children: ArticleTextNodeDto[];
}

export class ArticleDto {
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
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the article was updated',
    example: '2025-07-12T18:30:48.478Z',
  })
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  updatedAt: Date;

  @ApiProperty({
    description: 'The date when the article was published',
    example: '2025-07-12T18:30:48.519Z',
  })
  @IsDate()
  @Transform(({ value }: { value: string }) => new Date(value))
  publishedAt: Date;
}
