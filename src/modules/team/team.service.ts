import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import {
  configConstants,
  repositoriesConstants,
  rolesConstants,
} from 'src/constants';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { User_TeamDTO } from '../user_team/dto/user_team.dto';
import { UserTeamService } from '../user_team/user_team.service';
import { TeamDTO } from './dto/team.dto';
import { Team } from './team.entity';

@Injectable()
export class TeamService {
  constructor(
    @Inject(repositoriesConstants.TEAM_REPOSITORY)
    private readonly teamRepository: typeof Team,
    @Inject(repositoriesConstants.USER_REPOSITORY)
    private readonly userRepository: typeof User,
    @Inject(configConstants.SEQUELIZE) private readonly sequelize: Sequelize,
    private readonly userService: UserService,
    private readonly userTeamService: UserTeamService,
  ) {}

  async Create(team: TeamDTO): Promise<object> {
    await this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };

      const { id } = await this.teamRepository.create<Team>(
        team,
        transactionHost,
      );
      const addSelfToTeam = new User_TeamDTO(team.TeamOwnerId, id);
      await this.userTeamService.AddMemberToTeam(addSelfToTeam);
      const teamCreator = await this.userService.FindOneById(team.TeamOwner.id);
      const alreadyALeader = teamCreator.Roles.includes(
        rolesConstants.TEAM_LEADER,
      );
      !alreadyALeader &&
        (await teamCreator.update(
          {
            Roles: this.sequelize.fn(
              'array_append',
              this.sequelize.col('Roles'),
              rolesConstants.TEAM_LEADER,
            ),
          },
          { transaction: transactionHost.transaction },
        ));
    });

    return {
      message: 'Team has been created.',
    };
  }

  async GetTeamData(id: number) {
    return await this.teamRepository.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'TeamOwner',
          attributes: {
            exclude: ['Hash', 'Salt', 'createdAt', 'updatedAt'],
          },
        },
        {
          model: User,
          foreignKey: 'TeamId',
          as: 'Members',
          attributes: {
            exclude: ['Hash', 'Salt', 'createdAt', 'updatedAt', 'User_Team'],
          },
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
}
