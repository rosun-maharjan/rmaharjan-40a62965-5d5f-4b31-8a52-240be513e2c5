import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '@turbo-vets/data';
import { TasksService } from './tasks.service';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLogEntity)
        private auditRepo: Repository<AuditLogEntity>,

        @Inject(forwardRef(() => TasksService))
        private tasksService: TasksService,
    ) { }

    /**
     * Standardized logging for all system actions.
     */
    async log(userId: string, action: string, resource: string, details?: string) {
        const entry = this.auditRepo.create({ 
            userId, 
            action, 
            resource, 
            details,
            // timestamp is usually handled by @CreateDateColumn in the entity
        });
        return this.auditRepo.save(entry);
    }

    /**
     * CRITICAL for RBAC: Scopes logs to the organization.
     * We join the 'user' relation to verify the organization membership.
     */
    async getLogsByOrg(orgId: string) {
        return this.auditRepo.find({
            where: {
                user: {
                    organizationId: orgId
                }
            },
            relations: ['user'], // Includes user details (email/role) in the log results
            order: { timestamp: 'DESC' },
            take: 100 // Limit to last 100 entries for performance
        });
    }
    
    async getAllSystemLogs() {
        return this.auditRepo.find({ 
            relations: ['user'],
            order: { timestamp: 'DESC' } 
        });
    }
}