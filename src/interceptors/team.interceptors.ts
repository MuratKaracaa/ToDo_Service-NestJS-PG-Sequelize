import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { rolesConstants } from 'src/constants';

/**
 * Only allows an admin or a team leader to execute the requested task
 */
@Injectable()
export class AdminOrTeamLeaderRoleInterCeptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { Roles } = request.user;
    const authorized =
      Roles.includes(rolesConstants.ADMIN) ||
      Roles.includes(rolesConstants.TEAM_LEADER);
    if (!authorized) {
      throw new UnauthorizedException();
    }

    return next.handle().pipe();
  }
}
