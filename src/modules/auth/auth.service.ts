import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, pbkdf2Sync } from 'node:crypto';

import { UserService } from '../user/user.service';
import { UserDTO } from '../user/dto/user.dto';
import { User } from '../user/user.entity';
import { rolesConstants } from 'src/constants';
import { UserDoesNotExistException } from 'src/exceptions/userExceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Checks the credentials and returns a token along with the user info
   * @param email
   * @param password
   * @returns
   */
  async Validate(email: string, password: string) {
    const user = await this.userService.FindOneByMail(email);

    if (user === null) {
      throw new UserDoesNotExistException();
    }

    const IsValidPassword = this.CheckPassword(password, user.Hash, user.Salt);

    if (!IsValidPassword) {
      throw new UnauthorizedException({
        status: HttpStatus.NOT_ACCEPTABLE,
        error: 'Email or password is not valid.',
      });
    }

    const responseUser = new UserDTO(
      user.id,
      user.Email,
      user.UserName,
      user.Name,
      user.LastName,
      user.ProfileImage,
      user.Roles,
    );

    const token = await this.GenerateToken(responseUser);

    return {
      user: responseUser,
      token,
    };
  }

  /**
   * Creates a new user with the parameters specified in the body
   * @param user
   * @returns
   */
  public async Create(user: UserDTO) {
    const { salt, hash } = this.GenerateSaltAndHash(user.Password);

    const newUser: User = await this.userService.Create({
      Email: user.Email,
      Name: user.Name,
      LastName: user.LastName,
      ProfileImage: user.ProfileImage,
      Roles: [rolesConstants.MEMBER],
      UserName: user.UserName,
      Hash: hash,
      Salt: salt,
    });

    const { Hash, Salt, ...response } = newUser['dataValues'];

    const token = await this.GenerateToken(response);

    return {
      user: response,
      token,
    };
  }

  /**
   * Method the create an admin. Currently not restricted at all
   * @param user
   * @returns
   */
  async CreateAdmin(user: UserDTO) {
    const { salt, hash } = this.GenerateSaltAndHash(user.Password);

    const newUser: User = await this.userService.Create({
      Email: user.Email,
      Name: user.Name,
      LastName: user.LastName,
      ProfileImage: user.ProfileImage,
      Roles: [rolesConstants.ADMIN],
      UserName: user.UserName,
      Hash: hash,
      Salt: salt,
    });

    const { Hash, Salt, ...response } = newUser['dataValues'];

    const token = await this.GenerateToken(response);

    return {
      user: response,
      token,
    };
  }

  /**
   * generates a token using the id of the user
   * @param user
   * @returns
   */
  private async GenerateToken(user: UserDTO) {
    const token = await this.jwtService.signAsync(
      Object.assign({}, { id: user.id }),
    );

    return token;
  }

  /**
   * generates a salt and hash before saving the user to the database
   * @param password
   * @returns
   */
  private GenerateSaltAndHash(password: string) {
    const salt = randomBytes(32).toString('hex');
    const hash = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

    return { salt, hash };
  }

  /**
   * compares the password input to the hash and salt in the database
   * @param password
   * @param hash
   * @param salt
   * @returns
   */
  private CheckPassword(password: string, hash: string, salt: string): boolean {
    const afterCheck = pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString(
      'hex',
    );
    return afterCheck === hash;
  }
}
