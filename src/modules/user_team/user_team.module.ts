import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { DatabaseModule } from 'src/core/database/database.module';
import { TeamMemberOperationsMiddleware } from 'src/middlewares/team.middleware';
import { UserModule } from '../user/user.module';
import { Users_Teams_Providers } from './user_team.provider';
import { UserTeamService } from './user_team.service';

@Module({
  providers: [...Users_Teams_Providers, UserTeamService],
  exports: [...Users_Teams_Providers, UserTeamService],
  imports: [DatabaseModule, UserModule],
})
export class UserTeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TeamMemberOperationsMiddleware).forRoutes(
      {
        path: 'team/member-operation',
        method: RequestMethod.POST,
      },
      {
        path: 'team/member-operation',
        method: RequestMethod.DELETE,
      },
    );
  }
}
