import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { InvalidOperationForTeamMember } from 'src/exceptions/teamExceptions';
import { Team } from 'src/modules/team/team.entity';
import { User_Team } from 'src/modules/user_team/user_team.entity';
import { repositoriesConstants } from '../constants';

/**
 * Adding a member of removing one from a team will be checked before they are conducted
 */
@Injectable()
export class TeamMemberOperationsMiddleware implements NestMiddleware {
  constructor(
    @Inject(repositoriesConstants.USER_TEAM_REPOSITORY)
    private readonly userTeamRepository: typeof User_Team,
  ) {}
  async use(request: Request, response: Response, next: NextFunction) {
    const { TeamId, UserId } = request.body;

    const queryResult = await this.userTeamRepository.findOne({
      where: { TeamId: TeamId, UserId: UserId },
    });

    if (request.method === 'POST' && queryResult != null) {
      throw new InvalidOperationForTeamMember(
        'User is already a member of this team',
      );
    }

    if (request.method === 'DELETE' && queryResult === null) {
      throw new InvalidOperationForTeamMember(
        'User is not a member of this team',
      );
    }

    next();
  }
}

/**
 * Some routes require the list of team members of the requester so the include field of the request will be filled with join criterias before
 * the request passes the Guard layer
 */
@Injectable()
export class IncludeTeamListMiddleware implements NestMiddleware {
  constructor(
    @Inject(repositoriesConstants.USER_TEAM_REPOSITORY)
    private readonly userTeamRepository: typeof User_Team,
  ) {}
  async use(request: Request, response: Response, next: NextFunction) {
    request.include = [
      {
        model: Team,
        as: 'JoinedTeams',
        foreignKey: 'UserId',
        through: {
          attributes: [],
        },
      },
    ];

    next();
  }
}
