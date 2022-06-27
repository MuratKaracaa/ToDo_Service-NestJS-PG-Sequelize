import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { rolesConstants } from 'src/constants';
import { TaskDTO } from '../task/dto/task.dto';
import { Task } from '../task/task.entity';
import { TeamDTO } from '../team/dto/team.dto';
import { Team } from '../team/team.entity';
import { User_Team } from '../user_team/user_team.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  LastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  UserName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  Email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Hash: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  Salt: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
    validate: {
      isIn: [[...Object.values(rolesConstants)]],
    },
  })
  Roles: Array<string>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isUrl: true,
    },
  })
  ProfileImage: string;

  @HasMany(() => Team, {
    foreignKey: 'TeamOwnerId',
    as: 'OwnedTeams',
  })
  OwnedTeams: Array<TeamDTO>;

  @BelongsToMany(() => Team, () => User_Team, 'UserId', 'id')
  JoinedTeams: Array<TeamDTO>;

  @HasMany(() => Task, {
    foreignKey: 'TaskOwnerId',
    as: 'Tasks',
  })
  Tasks: Array<TaskDTO>;
}
