import { Provider } from '@nestjs/common';

import { Team } from './team.entity';
import { repositoriesConstants } from 'src/constants';

export const TeamProviders = [
  {
    provide: repositoriesConstants.TEAM_REPOSITORY,
    useValue: Team,
  },
] as Array<Provider>;
