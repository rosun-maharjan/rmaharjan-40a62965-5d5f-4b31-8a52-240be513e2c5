import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@turbo-vets/auth'; // Library alias
import { PassportModule } from '@nestjs/passport';

// Entities
import { 
  TaskEntity, 
  UserEntity, 
  OrganizationEntity, 
  AuditLogEntity 
} from '@turbo-vets/data';

// Services & Controllers
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { AuditService } from './tasks/audit.service';
import { AuthService } from '@turbo-vets/auth';
import { AppController } from './app.controller';
import { TasksController } from './tasks/tasks.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    // 1. Initialize ConfigModule globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    JwtModule.registerAsync({
      global: true, // This makes JwtService available to AuthService
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),

    // 2. Use forRootAsync to inject the ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true, // Note: Disable in production
      }),
    }),

    TypeOrmModule.forFeature([
      TaskEntity, 
      UserEntity, 
      OrganizationEntity, 
      AuditLogEntity
    ]),
    PassportModule
  ],
  controllers: [AppController, TasksController, AuthController],
  providers: [AppService, TasksService, AuditService, AuthService, JwtStrategy],
})
export class AppModule {}