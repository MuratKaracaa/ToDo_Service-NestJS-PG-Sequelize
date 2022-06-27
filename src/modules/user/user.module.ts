import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { UsersProviders } from './user.provider';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { QueryMiddleware } from 'src/middlewares/query.middleware';

@Module({
  providers: [UserService, ...UsersProviders],
  exports: [UserService, ...UsersProviders],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(QueryMiddleware).forRoutes(
      {
        path: 'user',
        method: RequestMethod.GET,
      },
      {
        path: 'user/teams',
        method: RequestMethod.GET,
      },
    );
  }
}
