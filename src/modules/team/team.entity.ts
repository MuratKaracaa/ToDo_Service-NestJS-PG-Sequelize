import {
  Table,
  Column,
  Model,
  DataType,
  HasOne,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import { TaskDTO } from '../task/dto/task.dto';
import { Task } from '../task/task.entity';
import { UserDTO } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { User_Team } from '../user_team/user_team.entity';

@Table
export class Team extends Model<Team> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  TeamName: string;

  @Column({
    type: DataType.INTEGER,
  })
  TeamOwnerId: number;

  @HasOne(() => User, {
    foreignKey: 'id',
    as: 'TeamOwner',
    sourceKey: 'TeamOwnerId',
  })
  TeamOwner: UserDTO;

  @BelongsToMany(() => User, () => User_Team, 'TeamId', 'id')
  Members: Array<UserDTO>;

  @HasMany(() => Task, {
    foreignKey: 'TeamId',
    as: 'TeamTasks',
    sourceKey: 'id',
  })
  TeamTasks: Array<TaskDTO>;
}
