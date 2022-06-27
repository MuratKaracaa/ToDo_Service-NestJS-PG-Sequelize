import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/core/database/database.module';
import { UserModule } from '../user/user.module';
import { UserTeamModule } from '../user_team/user_team.module';
import { TeamController } from './team.controller';
import { TeamProviders } from './team.provider';
import { TeamService } from './team.service';

@Module({
  providers: [TeamService, ...TeamProviders],
  exports: [TeamService, ...TeamProviders],
  controllers: [TeamController],
  imports: [UserModule, DatabaseModule, UserTeamModule],
})
export class TeamModule {}
