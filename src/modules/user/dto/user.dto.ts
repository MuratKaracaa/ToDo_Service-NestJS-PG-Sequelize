import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsEmail, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

import { TeamDTO } from 'src/modules/team/dto/team.dto';
import { TaskDTO } from 'src/modules/task/dto/task.dto';

export class UserDTO {
  @ApiProperty()
  id?: number;

  @ApiProperty()
  @IsString()
  Name: string;

  @ApiProperty()
  @IsString()
  LastName: string;

  @ApiProperty()
  @IsString()
  FullName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  UserName: string;

  @ApiProperty()
  @IsEmail()
  Email: string;

  @ApiProperty()
  @IsUrl()
  ProfileImage: string;

  @ApiProperty()
  @IsArray()
  @Type(() => String)
  Roles?: Array<string>;

  @ApiProperty()
  @IsString()
  Password?: string;

  @ApiProperty()
  @IsString()
  Hash?: string;

  @ApiProperty()
  @IsString()
  Salt?: string;

  @ApiProperty()
  OwnedTeams?: Array<TeamDTO>;

  @ApiProperty()
  JoinedTeams?: Array<TeamDTO>;

  @ApiProperty()
  @IsArray()
  @Type(() => TaskDTO)
  Tasks?: Array<TaskDTO>;

  constructor(
    id: number,
    email: string,
    userName: string,
    name: string,
    lastName: string,
    profileImage: string,
    roles: Array<string>,
  ) {
    this.id = id;
    this.Email = email;
    this.UserName = userName;
    this.FullName = name + ' ' + lastName;
    this.ProfileImage = profileImage;
    this.Roles = roles;
  }
}
