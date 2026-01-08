import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'roshan',
      password: 'roshan',
      database: 'TurboVets',
      autoLoadEntities: true, // This is key for Nx monorepos
      synchronize: true,      // Set to false in production!
    }),
    TypeOrmModule.forFeature([TaskEntity])
  ],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService],
})
export class AppModule {}
