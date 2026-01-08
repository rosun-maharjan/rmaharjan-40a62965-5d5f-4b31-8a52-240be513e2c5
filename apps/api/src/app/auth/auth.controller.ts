import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from '@turbo-vets/auth';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: any) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @Get('reset-password')
    async reset() {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('password123', salt);

        // This will print the EXACT hash your server generates for 'password123'
        return {
            password: 'password123',
            hash: hash
        };
    }
}