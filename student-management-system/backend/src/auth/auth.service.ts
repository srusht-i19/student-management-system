import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /** Single hard-coded admin read from .env (see assignment section 4.5). */
  async login({ email, password }: LoginDto) {
    const adminEmail = this.config.get<string>('ADMIN_EMAIL');
    const adminPassword = this.config.get<string>('ADMIN_PASSWORD');

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = { email, role: 'admin' };
    const accessToken = await this.jwt.signAsync({ sub: email, role: user.role });
    return { accessToken, user };
  }
}
