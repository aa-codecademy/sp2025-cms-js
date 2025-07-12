import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class StrapiService {
  private readonly axiosInstance: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    const strapiUrl = this.configService.get<string>('strapi.url');
    const apiToken = this.configService.get<string>('strapi.apiToken');

    this.axiosInstance = axios.create({
      baseURL: `${strapiUrl}/api`,
      headers: {
        'Content-Type': 'application/json',
        ...(apiToken && { Authorization: `Bearer ${apiToken}` }),
      },
    });
  }

  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.axiosInstance.get(endpoint, { params });
    return response.data as T;
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post(endpoint, data);
    return response.data as T;
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put(endpoint, data);
    return response.data as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete(endpoint);
    return response.data as T;
  }
}
