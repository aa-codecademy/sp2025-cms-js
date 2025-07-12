import { registerAs } from '@nestjs/config';

export default registerAs('strapi', () => ({
  url: process.env.STRAPI_URL || 'http://localhost:1337',
  apiToken: process.env.STRAPI_API_TOKEN,
  apiKey: process.env.STRAPI_API_KEY,
}));
