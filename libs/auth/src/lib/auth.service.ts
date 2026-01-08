import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@turbo-vets/data'; // Adjust path

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async login(email: string, pass: string) {
    // 1. Find the user and include the password (since we marked it select: false)
    const user = await this.userRepo.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role', 'organizationId'] 
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log('Comparing:', pass, 'with', user.password);

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate JWT Payload
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role, 
      orgId: user.organizationId 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        orgId: user.organizationId
      }
    };
  }
}