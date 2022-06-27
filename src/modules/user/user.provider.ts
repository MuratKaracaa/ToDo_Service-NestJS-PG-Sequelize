import { Provider } from '@nestjs/common';

import { User } from './user.entity';
import { repositoriesConstants } from 'src/constants';

export const UsersProviders = [
  {
    provide: repositoriesConstants.USER_REPOSITORY,
    useValue: User,
  },
] as Array<Provider>;
