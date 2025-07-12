import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import {
  ArticleDto,
  CreateArticleDto,
  UpdateArticleDto,
  ArticlesResponseDto,
} from './dto';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: ArticleDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createArticleDto: CreateArticleDto): Promise<ArticleDto> {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all articles with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of articles with pagination metadata.',
    type: ArticlesResponseDto,
  })
  findAll(
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize?: number,
  ): Promise<ArticlesResponseDto> {
    return this.articlesService.findAll(page || 1, pageSize || 10);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns the article with the specified ID.',
    type: ArticleDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ArticleDto> {
    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
    type: ArticleDto,
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleDto> {
    return this.articlesService.update(id, updateArticleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete article by ID' })
  @ApiParam({ name: 'id', description: 'Article ID', example: 1 })
  @ApiResponse({
    status: 204,
    description: 'The article has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.articlesService.remove(id);
  }
}
