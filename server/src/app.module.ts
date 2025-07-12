import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import strapiConfig from './config/strapi.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [strapiConfig],
    }),
    ArticlesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
