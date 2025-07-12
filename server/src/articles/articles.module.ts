import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { StrapiService } from '../services/strapi.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, StrapiService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
