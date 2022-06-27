import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import {
  configConstants,
  repositoriesConstants,
  rolesConstants,
} from 'src/constants';
import { UserService } from '../user/user.service';
import { User_TeamDTO } from './dto/user_team.dto';
import { User_Team } from './user_team.entity';

@Injectable()
export class UserTeamService {
  constructor(
    @Inject(repositoriesConstants.USER_TEAM_REPOSITORY)
    private readonly userTeamRepository: typeof User_Team,
    @Inject(configConstants.SEQUELIZE) private readonly sequelize: Sequelize,
    private readonly userService: UserService,
  ) {}

  async AddMemberToTeam(user_team: User_TeamDTO): Promise<object> {
    await this.sequelize.transaction(async (t) => {
      const transactionHost = { transaction: t };

      await this.userTeamRepository.create<User_Team>(user_team);
      const userToAddToTeam = await this.userService.FindOneById(
        user_team.UserId,
      );
      const isAlreadyHaveTeamMemberRole = userToAddToTeam.Roles.includes(
        rolesConstants.TEAM_MEMBER,
      );
      !isAlreadyHaveTeamMemberRole &&
        (await userToAddToTeam.update(
          {
            Roles: this.sequelize.fn(
              'array_append',
              this.sequelize.col('Roles'),
              rolesConstants.TEAM_MEMBER,
            ),
          },
          { transaction: transactionHost.transaction },
        ));
    });

    return {
      message: 'User has been added to team',
    };
  }

  async RemoveMemberFromTeam(user_team: User_TeamDTO) {
    return await this.userTeamRepository.destroy({ where: { ...user_team } });
  }
}
