import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

import { User } from 'generated/prisma';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string): Promise<User | Error> {
    const user = await this.authService.validateUserCredentials(
      login,
      password,
    );
    if (!user) throw new ForbiddenException();
    return user;
  }
}
