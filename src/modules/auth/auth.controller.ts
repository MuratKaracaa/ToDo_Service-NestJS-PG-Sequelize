import { Controller, Post, Body, UseFilters } from '@nestjs/common';

import { ControllerExceptionFilter } from 'src/filters/HttpException.filter';
import { UserDTO } from '../user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@UseFilters(ControllerExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('create-admin')
  async CreateAdmin(@Body() user: UserDTO) {
    return await this.authService.CreateAdmin(user);
  }

  @Post('sign-in')
  async SignIn(@Body() body) {
    return await this.authService.Validate(body.email, body.password);
  }

  @Post('sign-up')
  async SignUp(@Body() user: UserDTO) {
    return await this.authService.Create(user);
  }
}
