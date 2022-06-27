import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'User_Team' })
export class User_Team extends Model<User_Team> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Public.User.id',
  })
  UserId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    references: 'Public.Team.id',
  })
  TeamId: number;
}
