import { ApiProperty } from '@nestjs/swagger';

export class User_TeamDTO {
  @ApiProperty()
  UserId: number;

  @ApiProperty()
  TeamId: number;

  constructor(userId: number, teamId: number) {
    this.TeamId = teamId;
    this.UserId = userId;
  }
}
