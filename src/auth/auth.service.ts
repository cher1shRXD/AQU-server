import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { SignupCredentialDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginCredentialDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import * as config from 'config';
import { RefreshTokenDto } from './dto/refreshToken.dto';

interface JwtConfig {
  secret: string;
  expiration: string;
  refreshSecret: string;
  refreshExpiration: number;
}

const jwtConfig: JwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  private createRefreshToken(payload: { username: string }): string {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshExpiration,
      secret: jwtConfig.refreshSecret,
    });
    this.redisClient.set(
      payload.username,
      refreshToken,
      'EX',
      jwtConfig.refreshExpiration,
    );
    return refreshToken;
  }

  async signUp(signupCredentialDto: SignupCredentialDto): Promise<void> {
    return this.userRepository.createUser(signupCredentialDto);
  }

  async login(
    loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { username, password } = loginCredentialDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: jwtConfig.expiration });
    const refreshToken = this.createRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(
    refreshToken:RefreshTokenDto,
  ): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken.refreshToken, {
        secret: jwtConfig.refreshSecret,
      }) as { username: string };
      const { username } = payload;

      const storedToken = await this.redisClient.get(username);

      if (!storedToken || storedToken !== refreshToken.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { username };
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.createRefreshToken(newPayload)

      return { accessToken, refreshToken:newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
