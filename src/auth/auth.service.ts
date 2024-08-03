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

  private createRefreshToken(payload: { studentId: string }): string {
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.refreshExpiration,
      secret: jwtConfig.refreshSecret,
    });
    this.redisClient.set(
      payload.studentId,
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
    const { studentId, password } = loginCredentialDto;
    const user = await this.userRepository.findOne({ where: { studentId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { studentId };
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
      }) as { studentId: string };
      const { studentId } = payload;

      const storedToken = await this.redisClient.get(studentId);

      if (!storedToken || storedToken !== refreshToken.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { studentId };
      const accessToken = this.jwtService.sign(newPayload);
      const newRefreshToken = this.createRefreshToken(newPayload)

      return { accessToken, refreshToken:newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
