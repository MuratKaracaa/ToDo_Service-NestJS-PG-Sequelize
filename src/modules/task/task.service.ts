import {
  Inject,
  Injectable,
  Options,
  UnauthorizedException,
} from '@nestjs/common';
import {
  FindAttributeOptions,
  FindOptions,
  Includeable,
} from 'sequelize/types';

import { repositoriesConstants } from 'src/constants';
import { UserDTO } from '../user/dto/user.dto';
import { TaskDTO } from './dto/task.dto';
import { Task } from './task.entity';
import { TaskOptionals } from 'src/typings/taskoptionals';
import { User_Team } from '../user_team/user_team.entity';
import { HelperFunctions } from 'src/utils/helpers';
import { TeamDTO } from '../team/dto/team.dto';

@Injectable()
export class TaskService {
  helpers: HelperFunctions;
  constructor(
    @Inject(repositoriesConstants.TASK_REPOSITORY)
    private readonly taskRepository: typeof Task,
    @Inject(repositoriesConstants.USER_TEAM_REPOSITORY)
    private readonly userTeamRepository: typeof User_Team,
  ) {
    this.helpers = new HelperFunctions();
  }

  async Create(task: TaskDTO) {
    return await this.taskRepository.create<Task>(task);
  }

  async Update(id: number, body: object): Promise<Array<number>> {
    return await this.taskRepository.update({ ...body }, { where: { id } });
  }

  async GetTaskById(id: number) {
    return await this.taskRepository.findOne({ where: { id } });
  }

  async GetTasksByTeam(
    joinedTeams: Array<TeamDTO>,
    options: FindOptions,
    attributes: FindAttributeOptions,
  ) {
    return await this.taskRepository.findAll({
      where: { TeamId: [joinedTeams.map((team) => team.id)], IsPrivate: false },
      ...options,
      attributes,
    });
  }

  async GetTasksByOwner(
    TaskOwnerId: number,
    options: FindOptions,
    attributes: FindAttributeOptions,
    optionals: TaskOptionals,
  ) {
    const { IsPrivate, user } = optionals;

    const userParamPassed = user != undefined;

    return await this.taskRepository.findAll({
      where: {
        TaskOwnerId,
        IsPrivate,
        ...(userParamPassed && {
          TeamId: [
            (
              await this.helpers.GetCommonTeams(user.id, TaskOwnerId)
            ).map((team) => team.TeamId),
          ],
        }),
      },
      ...options,
      attributes,
    });
  }

  async DeleteTask(id: number, user: UserDTO) {
    const taskToDelete = await this.taskRepository.findByPk(id);
    const isInTheTeamWhereTaskBelongs = user.JoinedTeams.some(
      (team) => team.id === taskToDelete.TeamId,
    );
    if (!isInTheTeamWhereTaskBelongs) {
      throw new UnauthorizedException();
    }
    return await taskToDelete.destroy();
  }
}
