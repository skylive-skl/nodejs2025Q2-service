import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

import { ReqData } from '../auth.type';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string): Promise<ReqData['user']> {
    const user = await this.authService.validateUserCredentials(
      login,
      password,
    );
    if (!user) throw new ForbiddenException();
    return {
      userId: user.id,
      login: user.login,
      version: user.version,
    };
  }
}
