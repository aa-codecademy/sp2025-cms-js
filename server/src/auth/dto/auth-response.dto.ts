import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'User information',
    example: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
  })
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
