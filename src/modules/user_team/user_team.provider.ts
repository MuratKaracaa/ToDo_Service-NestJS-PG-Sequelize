import { Provider } from '@nestjs/common';

import { User_Team } from './user_team.entity';
import { repositoriesConstants } from 'src/constants';

export const Users_Teams_Providers = [
  {
    provide: repositoriesConstants.USER_TEAM_REPOSITORY,
    useValue: User_Team,
  },
] as Array<Provider>;
