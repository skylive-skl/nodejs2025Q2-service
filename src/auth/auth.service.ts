import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../user/hash.service';
import { UserService } from '../user/user.service';
import { ReqData } from './auth.type';
import { User } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private hashService: HashService,
    private jwtService: JwtService,
  ) { }
  async validateUserCredentials(
    login: string,
    password: string,
  ): Promise<User | Error> {
    const user = await this.userService.getUserByLogin(login);
    if (!user) throw new ForbiddenException();
    const valid = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!valid) throw new ForbiddenException();

    return user;
  }
  async generateToken(user: ReqData['user']) {
    const userData: ReqData['user'] = {
      id: user.id,
      login: user.login,
      version: user.version,
    };
    const access_token = await this.jwtService.signAsync(userData, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET_KEY,
    });
    const refresh_token = await this.jwtService.signAsync(userData, {
      expiresIn: '1d',
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });
    return {
      access_token,
      refresh_token,
      data: userData,
    };
  }
  validateToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
  getUserFromToken(token: string) {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
