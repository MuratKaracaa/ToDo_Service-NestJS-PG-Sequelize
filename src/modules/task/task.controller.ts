import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { TaskDTO } from './dto/task.dto';
import { TaskService } from './task.service';
import { ControllerExceptionFilter } from 'src/filters/HttpException.filter';

@UseGuards(AuthGuard('jwt'))
@UseFilters(ControllerExceptionFilter)
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * creates a task with the specified fields. the task owner id is by default the id gotten via passport and if a team is not specified the task is marked as
   * private logically
   */
  @Post()
  async CreateTask(@Body() task: TaskDTO, @Req() request: Request) {
    task.TaskOwnerId = request.user.id;
    const teamIdSpecified = task.TeamId != null;
    task.IsPrivate = teamIdSpecified ? false : true;
    return await this.taskService.Create(task);
  }

  /**
   * updates a task with the specified fields in the body. it can be any of the fields
   * @param id
   * @param body
   * @returns
   */
  @Put(':id')
  async UpdateTask(@Param('id') id: string, @Body() body: object) {
    return await this.taskService.Update(+id, body);
  }

  /**
   * get the task specified with id only if the task belongs the team of the requester
   * @param id
   * @returns
   */
  @Get(':id')
  async GetTaskById(@Param('id') id: string) {
    return await this.taskService.GetTaskById(+id);
  }

  /**
   * get tasks of your team, excludes all private tasks
   * @param request
   * @returns
   */
  @Get('team')
  async GetTasksOfYourTeam(@Req() request: Request) {
    return await this.taskService.GetTasksByTeam(
      request.user.JoinedTeams,
      request.options,
      request.attributes,
    );
  }

  /**
   * get your own tasks, private tasks are included
   * @param request
   * @returns
   */
  @Get('self')
  async GetTasksOfYourself(@Req() request: Request) {
    return await this.taskService.GetTasksByOwner(
      +request.user.id,
      request.options,
      request.attributes,
      { IsPrivate: true },
    );
  }

  /**
   * get the tasks of a user if you are in the same team(s)
   * @param id
   * @param request
   * @returns
   */
  @Get('user/:id')
  async GetTasksByOwner(@Param('id') id: string, @Req() request: Request) {
    return await this.taskService.GetTasksByOwner(
      +id,
      request.options,
      request.attributes,
      { user: request.user, IsPrivate: false },
    );
  }

  /**
   * delete task ıf a user if you are in the same team
   * @param id
   * @param request
   * @returns
   */
  @Delete(':id')
  async DeleteTask(@Param('id') id: string, @Req() request: Request) {
    return await this.taskService.DeleteTask(+id, request.user);
  }
}
