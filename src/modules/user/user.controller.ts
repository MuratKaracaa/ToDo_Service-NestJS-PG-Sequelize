import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { ControllerExceptionFilter } from 'src/filters/HttpException.filter';
import {
  AdminRoleInterceptor,
  DeleteSelfInterceptor,
  TeamDataQueryInterceptor,
} from 'src/interceptors/user.interceptor';
import { UserService } from './user.service';

@Controller('user')
@UseFilters(ControllerExceptionFilter)
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * updates the profile of a user specified fields in the body
   * @param request
   * @param body
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Put()
  async UpdateUserProfile(@Req() request: Request, @Body() body) {
    return await this.userService.Update(request.user.id, body);
  }

  /**
   * deletes a user, only can be conducted by an admin
   * @param id
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AdminRoleInterceptor, DeleteSelfInterceptor)
  @Delete(':id')
  async DeleteUser(@Param('id') id: string) {
    return await this.userService.Delete(+id);
  }

  /**
   * admins can get a list of users
   * @param request
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(AdminRoleInterceptor)
  @Get()
  async GetUsers(@Req() request: Request) {
    const { options, attributes } = request;

    return await this.userService.FetchUsers(options, attributes);
  }

  /**
   * user can get a list of teams they created
   * @param request
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TeamDataQueryInterceptor)
  @Get('teams')
  async GetOwnedTeamData(@Req() request: Request) {
    return await this.userService.GetOwnedTeamData(request.user.id);
  }
}
