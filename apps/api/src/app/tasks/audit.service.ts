import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { TasksService } from './tasks.service';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLogEntity)
        private auditRepo: Repository<AuditLogEntity>,
        
        @Inject(forwardRef(() => TasksService)) // And here
        private tasksService: TasksService,
    ) { }

    async log(userId: string, action: string, resource: string, details?: string) {
        const entry = this.auditRepo.create({ userId, action, resource, details });
        return this.auditRepo.save(entry);
    }

    async getLogs() {
        return this.auditRepo.find({ order: { timestamp: 'DESC' } });
    }
}