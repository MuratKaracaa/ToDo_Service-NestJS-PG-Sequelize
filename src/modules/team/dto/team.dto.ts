import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { UserDTO } from 'src/modules/user/dto/user.dto';
import { TaskDTO } from 'src/modules/task/dto/task.dto';

export class TeamDTO {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  TeamName: string;

  @ApiProperty({ type: () => UserDTO })
  TeamOwner: UserDTO;

  @ApiProperty()
  TeamOwnerId: number;

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => UserDTO)
  Members: Array<UserDTO>;

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  @Type(() => TaskDTO)
  Tasks: Array<TaskDTO>;
}
