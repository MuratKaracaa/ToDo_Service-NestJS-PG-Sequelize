import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { QueryMiddleware } from 'src/middlewares/query.middleware';
import { IncludeTeamListMiddleware } from 'src/middlewares/team.middleware';
import { UserModule } from '../user/user.module';
import { UserTeamModule } from '../user_team/user_team.module';
import { TaskController } from './task.controller';
import { TaskProviders } from './task.provider';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, ...TaskProviders],
  exports: [TaskService, ...TaskProviders],
  imports: [UserModule, UserTeamModule],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryMiddleware).forRoutes(
      {
        path: 'task/user/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'task/team/:id',
        method: RequestMethod.GET,
      },
    );
    consumer.apply(IncludeTeamListMiddleware).forRoutes(
      {
        path: 'task/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'task/:id',
        method: RequestMethod.PUT,
      },
      {
        path: 'task/:id',
        method: RequestMethod.DELETE,
      },
      {
        path: 'task/user/:id',
        method: RequestMethod.GET,
      },
      {
        path: 'task/team',
        method: RequestMethod.GET,
      },
    );
  }
}
