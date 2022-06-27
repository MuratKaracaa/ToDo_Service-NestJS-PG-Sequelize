import { Provider } from '@nestjs/common';

import { Task } from './task.entity';
import { repositoriesConstants } from 'src/constants';

export const TaskProviders = [
  {
    provide: repositoriesConstants.TASK_REPOSITORY,
    useValue: Task,
  },
] as Array<Provider>;
