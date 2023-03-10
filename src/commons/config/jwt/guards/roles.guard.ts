// Import Modules
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Import Roles Decorator
import { ROLES_KEY } from '@commons/decorator/role.decorator';

// Import Api Exceptions
import { ApiForbiddenException } from '@commons/exception/api-exception';

@Injectable()
export class RolesAuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    matchRole(roles: string[], userRole: string): boolean {
        return roles.some((role) => role === userRole);
    }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const getUserRole = request.user?.role || '';
        const accessRole = this.matchRole(requiredRole, getUserRole);

        if (!accessRole) {
            throw new ApiForbiddenException('access denied');
        }

        return accessRole;
    }
}
