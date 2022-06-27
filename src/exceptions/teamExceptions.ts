import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * While adding or removing someone to/from team, if user is not there or user is already in team, this error will be thrown
 */
export class InvalidOperationForTeamMember extends HttpException {
  constructor(message) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
