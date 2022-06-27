import { UserDTO } from 'src/modules/user/dto/user.dto';

export interface TaskOptionals {
  user?: UserDTO;
  IsPrivate?: boolean;
}
