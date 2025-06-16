import {
  Controller,
  ForbiddenException,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { ReqData } from './auth.type';
import { UserService } from 'src/user/user.service';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @HttpCode(200)
  @Post('signup')
  async signUp(@Body() data: LoginDto) {
    return this.userService.create(data);
  }
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Body() data: LoginDto, @Request() req: ReqData) {
    return this.authService.generateToken(req.user);
  }

  @HttpCode(200)
  @Post('refresh')
  async refresh(@Body() data: RefreshDto) {
    const isValid = this.authService.validateRefreshToken(data.refreshToken);
    if (!isValid) {
      throw new ForbiddenException('Invalid refresh token');
    }
    const user = this.authService.getUserFromToken(data.refreshToken);
    return this.authService.generateToken(user);
  }
  @UseGuards(JwtAuthGuard)
  @Post('me')
  test(@Request() req: ReqData) {
    return req.user;
  }
}
