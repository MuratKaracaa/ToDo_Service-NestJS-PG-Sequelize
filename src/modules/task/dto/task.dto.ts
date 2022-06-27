import { ApiProperty } from '@nestjs/swagger';

import { TeamDTO } from 'src/modules/team/dto/team.dto';
import { UserDTO } from 'src/modules/user/dto/user.dto';
import { Stage } from '../enum/stage.enum';

export class TaskDTO {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  TaskName: string;

  @ApiProperty()
  TaskDescription: string;

  @ApiProperty()
  IsPrivate: boolean;

  @ApiProperty()
  Stage: Stage;

  @ApiProperty()
  TaskOwnerId: number;

  @ApiProperty({ type: () => UserDTO })
  TaskOwner: UserDTO;

  @ApiProperty()
  TeamId: number;

  @ApiProperty({ type: () => TeamDTO })
  OwnerTeam: TeamDTO;
}
