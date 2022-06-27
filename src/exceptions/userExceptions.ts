import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Specifies that the user who is trying to login does not exist
 */

export class UserDoesNotExistException extends HttpException {
  constructor() {
    super('User does not exist', HttpStatus.BAD_REQUEST);
  }
}

/**
 * Roles can never be updated via requests. They are organized only logically
 */
export class RolesCannotBeExternallyModifiedException extends HttpException {
  constructor() {
    super('Roles cannot be modified externally', HttpStatus.UNAUTHORIZED);
  }
}

/**
 * You cannot update someone elses profile
 */
export class OnlySelfProfileCanBeUpdatedException extends HttpException {
  constructor() {
    super('You can only update your own profile', HttpStatus.UNAUTHORIZED);
  }
}

/**
 * Currently users cannot destroy their own accounts
 */
export class CannotDeleteSelfException extends HttpException {
  constructor() {
    super('You cannot delete your profile', HttpStatus.FORBIDDEN);
  }
}

export class NotTheLeaderOfATeamException extends HttpException {
  constructor() {
    super('You are not the leader of a team', HttpStatus.BAD_REQUEST);
  }
}
