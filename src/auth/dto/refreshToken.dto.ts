import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ type: String, description: 'refresh token' })
  refreshToken: string;
}
