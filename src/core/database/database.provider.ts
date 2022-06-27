import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Task } from 'src/modules/task/task.entity';
import { Team } from 'src/modules/team/team.entity';
import { User } from 'src/modules/user/user.entity';
import { User_Team } from 'src/modules/user_team/user_team.entity';
import { configConstants } from '../../constants';
import { databaseConfig } from './database.config';

const { PRODUCTION, SEQUELIZE } = configConstants;

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config: SequelizeOptions;
      switch (process.env.NODE_ENV) {
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([User, Team, User_Team, Task]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
