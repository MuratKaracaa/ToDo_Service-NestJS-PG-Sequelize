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
import { CannotDeleteSelfException } from 'src/exceptions/userExceptions';
import { HelperFunctions } from 'src/utils/helpers';

/**
 * Only allows an admin to execute the requested task
 */
@Injectable()
export class AdminRoleInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { Roles } = request.user;
    const authorized = Roles.includes(rolesConstants.ADMIN);
    if (!authorized) {
      throw new UnauthorizedException();
    }

    return next.handle().pipe();
  }
}

/**
 * Prevents from deleting own profile
 */
@Injectable()
export class DeleteSelfInterceptor implements NestInterceptor {
  helpers: HelperFunctions;
  constructor() {
    this.helpers = new HelperFunctions();
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const { Roles } = request.user;
    const ownsATeam = Roles.includes(rolesConstants.TEAM_LEADER);
    if (!ownsATeam) {
      throw new UnauthorizedException();
    }

    return next.handle().pipe();
  }
}

/**
 * Prevents from team query if not a team leader
 */
@Injectable()
export class TeamDataQueryInterceptor implements NestInterceptor {
  helpers: HelperFunctions;
  constructor() {
    this.helpers = new HelperFunctions();
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const isSelf = this.helpers.CheckIsSelf(context);
    if (isSelf) {
      throw new CannotDeleteSelfException();
    }

    return next.handle().pipe();
  }
}
