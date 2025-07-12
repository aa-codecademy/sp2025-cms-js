import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StrapiService } from '../services/strapi.service';
import { LoginDto, RegisterDto } from './dto';

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}

interface StrapiAuthResponse {
  jwt: string;
  user: StrapiUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly strapiService: StrapiService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      // Use Strapi's built-in authentication endpoint
      const strapiAuth =
        await this.strapiService.postPublic<StrapiAuthResponse>('/auth/local', {
          identifier: loginDto.email,
          password: loginDto.password,
        });

      // Return Strapi's JWT and user info
      return {
        accessToken: strapiAuth.jwt,
        user: {
          id: strapiAuth.user.id,
          name: strapiAuth.user.username,
          email: strapiAuth.user.email,
          role: strapiAuth.user.role?.name || 'user',
        },
      };
    } catch (error) {
      console.error('Login error:', error?.response?.data || error);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      // Use Strapi's built-in registration endpoint
      const strapiAuth =
        await this.strapiService.postPublic<StrapiAuthResponse>(
          '/auth/local/register',
          {
            username: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
          },
        );

      // Return Strapi's JWT and user info
      return {
        accessToken: strapiAuth.jwt,
        user: {
          id: strapiAuth.user.id,
          name: strapiAuth.user.username,
          email: strapiAuth.user.email,
          role: strapiAuth.user.role?.name || 'user',
        },
      };
    } catch (error) {
      if (
        error?.response?.data?.error?.message?.includes('Email already taken')
      ) {
        throw new ConflictException('User with this email already exists');
      }
      console.error('Registration error:', error?.response?.data || error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  async validateUser(userId: number): Promise<any> {
    // Optionally, fetch user from Strapi's /users/me endpoint using JWT
    return null;
  }
}
