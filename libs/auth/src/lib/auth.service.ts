import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BaseAuthService {
  constructor(protected readonly jwtService: JwtService) {}

  async comparePasswords(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  generateToken(payload: any) {
    return this.jwtService.sign(payload);
  }
}