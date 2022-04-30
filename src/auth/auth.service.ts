import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PayloadTokenDTO, ResponseTokenDTO, SignInDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signIn(payload: SignInDTO): Promise<ResponseTokenDTO> {
    const user = await this.prisma.user.findUnique({
      where: {
        username: payload.username,
      },
    });
    if (!user) throw new ForbiddenException('Credentials Incorrect!');
    const pwMatches = await argon.verify(user.password, payload.password);
    if (!pwMatches) throw new ForbiddenException('Credentials Incorrect!');
    delete user.password;
    return this.generateToken(user);
  }

  async generateToken(payload: PayloadTokenDTO): Promise<ResponseTokenDTO> {
    const data = {
      sub: payload.id,
      ...payload,
    };
    const secret = await this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(data, {
      expiresIn: '15m',
      secret,
    });

    return { access_token: token };
  }
}
