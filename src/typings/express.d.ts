import { FindOptions, Includeable } from 'sequelize';

import { UserDTO } from 'src/modules/user/dto/user.dto';
import { User_TeamDTO } from 'src/modules/user_team/dto/user_team.dto';
import { User as ModelUser } from '../modules/user/user.entity';

declare global {
  namespace Express {
    interface User extends UserDTO, Model<ModelUser> {}
    interface Request {
      options?: FindOptions;
      attributes?: FindAttributeOptions;
      include?: Array<Includeable>;
    }
  }
}

export {};
