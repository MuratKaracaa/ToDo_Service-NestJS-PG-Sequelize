import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';

import { TeamDTO } from '../team/dto/team.dto';
import { Team } from '../team/team.entity';
import { UserDTO } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { Stage } from './enum/stage.enum';

@Table
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  TaskName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  TaskDescription: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  IsPrivate: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: Stage.TODO,
  })
  Stage: Stage;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  TaskOwnerId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  TeamId: number;

  @HasOne(() => User, {
    foreignKey: 'id',
    as: 'TaskOwner',
    sourceKey: 'TaskOwnerId',
  })
  TaskOwner: UserDTO;

  @HasOne(() => Team, {
    foreignKey: 'id',
    as: 'OwnerTeam',
    sourceKey: 'TeamId',
  })
  OwnerTeam: TeamDTO;
}
