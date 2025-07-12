import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { StrapiService } from '../services/strapi.service';
import {
  ArticleDto,
  CreateArticleDto,
  UpdateArticleDto,
  StrapiArticleDto,
} from './dto';
import { StrapiResponseDto } from '../shared/dto';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(private readonly strapiService: StrapiService) {}

  private transformStrapiArticle(strapiArticle: StrapiArticleDto): ArticleDto {
    this.logger.debug(
      'Transforming Strapi article:',
      JSON.stringify(strapiArticle, null, 2),
    );

    return {
      id: strapiArticle.id,
      documentId: strapiArticle.documentId,
      title: strapiArticle.title,
      content: strapiArticle.content,
      publishedAt: new Date(strapiArticle.publishedAt),
      createdAt: new Date(strapiArticle.createdAt),
      updatedAt: new Date(strapiArticle.updatedAt),
    };
  }

  async findAll(
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: ArticleDto[];
    meta: {
      pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
      };
    };
  }> {
    try {
      const response = await this.strapiService.get<
        StrapiResponseDto<StrapiArticleDto[]>
      >('/articles', {
        'pagination[page]': page,
        'pagination[pageSize]': pageSize,
        populate: '*',
      });

      this.logger.debug('Strapi response:', JSON.stringify(response, null, 2));

      return {
        data: response.data.map((article) =>
          this.transformStrapiArticle(article),
        ),
        meta: {
          pagination: response.meta?.pagination || {
            page,
            pageSize,
            pageCount: 1,
            total: response.data.length,
          },
        },
      };
    } catch (error) {
      this.logger.error('Error fetching articles:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<ArticleDto> {
    try {
      const response = await this.strapiService.get<
        StrapiResponseDto<StrapiArticleDto>
      >(`/articles/${id}`, {
        populate: '*',
      });

      this.logger.debug(
        'Strapi single article response:',
        JSON.stringify(response, null, 2),
      );

      return this.transformStrapiArticle(response.data);
    } catch (error) {
      this.logger.error(`Error fetching article ${id}:`, error);
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  async create(createArticleDto: CreateArticleDto): Promise<ArticleDto> {
    try {
      const response = await this.strapiService.post<
        StrapiResponseDto<StrapiArticleDto>
      >('/articles', {
        data: createArticleDto,
      });

      this.logger.debug(
        'Strapi create response:',
        JSON.stringify(response, null, 2),
      );

      return this.transformStrapiArticle(response.data);
    } catch (error) {
      this.logger.error('Error creating article:', error);
      throw error;
    }
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleDto> {
    try {
      const response = await this.strapiService.put<
        StrapiResponseDto<StrapiArticleDto>
      >(`/articles/${id}`, {
        data: updateArticleDto,
      });

      this.logger.debug(
        'Strapi update response:',
        JSON.stringify(response, null, 2),
      );

      return this.transformStrapiArticle(response.data);
    } catch (error) {
      this.logger.error(`Error updating article ${id}:`, error);
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.strapiService.delete(`/articles/${id}`);
    } catch (error) {
      this.logger.error(`Error deleting article ${id}:`, error);
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
  }
}
