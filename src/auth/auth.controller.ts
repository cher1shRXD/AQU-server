import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupCredentialDto } from './dto/signup.dto';
import { LoginCredentialDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Controller('auth')
@ApiTags('AUTH')
@ApiBearerAuth('access-token')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) signupCredentialDto: SignupCredentialDto,
  ): Promise<void> {
    return this.authService.signUp(signupCredentialDto);
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) loginCredentialDto: LoginCredentialDto,
  ): Promise<{ accessToken: string, refreshToken:string }> {
    return this.authService.login(loginCredentialDto);
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async me(@GetUser() user: User) : Promise<User> {
    return user;
  }

  @Post('/refresh')
  async refresh(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
