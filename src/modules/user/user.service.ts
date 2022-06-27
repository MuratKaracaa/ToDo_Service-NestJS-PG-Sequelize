import { Inject, Injectable } from '@nestjs/common';
import { FindOptions, Includeable } from 'sequelize';

import { repositoriesConstants } from 'src/constants';
import { RolesCannotBeExternallyModifiedException } from 'src/exceptions/userExceptions';
import { Team } from '../team/team.entity';
import { UserDTO } from './dto/user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject(repositoriesConstants.USER_REPOSITORY)
    private readonly userRepository: typeof User,
  ) {}

  async Create(user: UserDTO): Promise<User> {
    return await this.userRepository.create<User>(user);
  }

  async FetchUsers(
    options: FindOptions,
    attributes: Array<string>,
  ): Promise<Array<User>> {
    return await this.userRepository.findAll({
      ...options,
      attributes,
    });
  }

  async FindOneByMail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { Email: email } });
  }

  async FindOneById(id: number, include?: Array<Includeable>): Promise<User> {
    return await this.userRepository.findOne({ where: { id }, include });
  }

  async Update(id: number, body: object): Promise<Array<number>> {
    if (body.hasOwnProperty('Roles')) {
      throw new RolesCannotBeExternallyModifiedException();
    }
    return await this.userRepository.update({ ...body }, { where: { id } });
  }

  async Delete(id: number) {
    return await this.userRepository.destroy({ where: { id } });
  }

  async GetOwnedTeamData(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      attributes: {
        include: ['Name', 'LastName', 'Email', 'UserName', 'ProfileImage'],
      },
      include: [
        {
          model: Team,
          as: 'OwnedTeams',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    });
  }

  async GetJoinedTeamsData(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      attributes: {
        include: ['Name', 'LastName', 'Email', 'UserName', 'ProfileImage'],
      },
      include: [
        {
          model: Team,
          as: 'JoinedTeams',
          foreignKey: 'UserId',
          through: {
            attributes: [],
          },
        },
      ],
    });
  }
}
