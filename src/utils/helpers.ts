import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FindOptions, Order } from 'sequelize';
import { OrderCriteriaSpecificationError } from 'src/exceptions/requestExceptions';
import { Request } from 'express';
import { User_Team } from 'src/modules/user_team/user_team.entity';

export class HelperFunctions {
  constructor(private readonly userTeamRepository?: typeof User_Team) {}

  GetOrderCriterias(
    order: string | Array<string>,
    by: string | Array<string>,
  ): Order {
    let orderCriterias;

    // checks the query string for the cases specified in the error
    if ((typeof order === 'string' && by === undefined) || null) {
      orderCriterias = [[order, 'ASC']];
    } else if (typeof order === 'string' && typeof by === 'string') {
      orderCriterias = [[order, by]];
    } else if ((typeof order === 'object' && by === undefined) || null) {
      orderCriterias = (order as Array<string>).map((criteria) => [
        criteria,
        'ASC',
      ]);
    } else if (
      typeof order === 'object' &&
      by === 'object' &&
      order.length === by.length
    ) {
      orderCriterias = (order as Array<string>).map((criteria, index) => [
        criteria,
        by[index],
      ]);
    } else {
      throw new OrderCriteriaSpecificationError();
    }

    return orderCriterias;
  }

  SetFindOptions(
    limit: string,
    offset: string,
    orderCriterias: Order,
  ): FindOptions {
    //creates an options object based on the query parameters, sets default values for some if not specified
    const options: FindOptions = {
      limit: +(limit ?? 20) || +limit,
      ...((offset != null || undefined) && { offset: +offset }),
      ...((orderCriterias != null || undefined) && { order: orderCriterias }),
    };

    return options;
  }

  CheckIsSelf(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { id: paramId } = request.params;
    const { id } = request.user;
    return id === +paramId;
  }

  async GetCommonTeams(UserId: number, TaskOwnerId: number) {
    const requestersTeams = await this.userTeamRepository.findAll({
      where: { UserId },
    });

    const taskOwnersTeams = await this.userTeamRepository.findAll({
      where: { UserId: TaskOwnerId },
    });

    const commonTeams: Array<User_Team> = [];

    for (const reqT of requestersTeams) {
      for (const ownT of taskOwnersTeams) {
        if (reqT.TeamId === ownT.TeamId) {
          commonTeams.push(reqT);
        }
      }
    }

    if (commonTeams.length === 0) {
      throw new UnauthorizedException();
    }
    return commonTeams;
  }
}
