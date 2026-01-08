import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { TaskEntity } from './entities/task.entity';
import { UserEntity } from './entities/user.entity';
import { AuditLogEntity } from './entities/audit-log.entity';
import { OrganizationEntity } from './entities/organization.entity';

// Services & Controllers
import { AppService } from './app.service';
import { TasksService } from './tasks/tasks.service';
import { AuditService } from './tasks/audit.service';
import { AppController } from './app.controller';
import { TasksController } from './tasks/tasks.controller';

@Module({
  imports: [
    // 1. Initialize ConfigModule globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    ])
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService, AuditService],
})
export class AppModule {}