import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleHierarchy, Role } from './permissions.js';
import { ROLES_KEY } from './roles.decorator.js';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Get the roles required for this route (checking method first, then controller)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are defined via @Roles(), allow access (standard AuthGuard still handles the JWT)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User role not found in request');
    }

    // 2. Role Inheritance Check
    const userLevel = RoleHierarchy[user.role as Role] || 0;
    
    // We check if the user's level meets the MINIMUM level required by the @Roles decorator
    // Usually, you'd pick the highest required level from the array
    const requiredLevel = Math.min(...requiredRoles.map(role => RoleHierarchy[role]));

    if (userLevel < requiredLevel) {
      throw new ForbiddenException(
        `Insufficient permissions. Your level: ${userLevel}, Required: ${requiredLevel} (${requiredRoles.join(', ')})`
      );
    }

    return true;
  }
}