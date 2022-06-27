import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { ControllerExceptionFilter } from 'src/filters/HttpException.filter';
import { AdminOrTeamLeaderRoleInterCeptor } from 'src/interceptors/team.interceptors';
import { UserDTO } from '../user/dto/user.dto';
import { User_TeamDTO } from '../user_team/dto/user_team.dto';
import { UserTeamService } from '../user_team/user_team.service';
import { TeamDTO } from './dto/team.dto';
import { TeamService } from './team.service';

@Controller('team')
@UseFilters(ControllerExceptionFilter)
export class TeamController {
  constructor(
    private teamService: TeamService,
    private userTeamService: UserTeamService,
  ) {}

  /**
   * creates a team, only the name of the team is enough
   * @param team
   * @param request
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async CreateTeam(@Body() team: TeamDTO, @Req() request: Request) {
    team.TeamOwnerId = request.user.id;
    team.TeamOwner = new UserDTO(
      request.user.id,
      request.user.Email,
      request.user.UserName,
      request.user.Name,
      request.user.LastName,
      request.user.ProfileImage,
      request.user.Roles,
    );

    return await this.teamService.Create(team);
  }

  /**
   * gets the owner and the members of a team
   * @param id
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async GetTeamData(@Param('id') id: string) {
    return await this.teamService.GetTeamData(+id);
  }

  /**
   * adds a member to the team
   * @param user_team
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AdminOrTeamLeaderRoleInterCeptor)
  @Post('member-operation')
  async AddMemberToTeam(@Body() user_team: User_TeamDTO) {
    return await this.userTeamService.AddMemberToTeam(user_team);
  }

  /**
   * removes a member from the team
   * @param user_team
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AdminOrTeamLeaderRoleInterCeptor)
  @Delete('member-operation')
  async RemoveMemberFromTeam(@Body() user_team: User_TeamDTO) {
    return await this.userTeamService.RemoveMemberFromTeam(user_team);
  }
}
