// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { BaseAuthService } from '@turbo-vets/auth';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { UserEntity } from '../entities/user.entity';

// @Injectable()
// export class AuthService extends BaseAuthService {
//   constructor(
//     @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
//     jwtService: JwtService // Passed to super
//   ) {
//     super(jwtService);
//   }

//   async login(email: string, pass: string) {
//     const user = await this.userRepo.findOne({ where: { email }, select: ['id', 'password', 'role'] });
    
//     // Using the logic inherited from the library
//     if (user && await this.comparePasswords(pass, user.password)) {
//       return { access_token: this.generateToken({ sub: user.id, role: user.role }) };
//     }
//     throw new UnauthorizedException();
//   }
// }