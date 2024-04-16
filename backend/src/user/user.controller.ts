import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { IUserRO } from './user.interface';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/util/validation.pipe';
import { UserDto } from './dto';
import { FirebaseApp } from 'src/util/firebase';
import { User as UserEntity } from './user.entity';
import { User } from './user.decorator';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseApp: FirebaseApp,
  ) {}

  @Get('user')
  async findMe(@User('username') username: string): Promise<IUserRO> {
    return this.userService.findByUsername(username);
  }

  @UsePipes(new ValidationPipe())
  @Post('users')
  async create(@Body('user') userData: UserDto) {
    return this.userService.create(userData);
  }

  @UsePipes(new ValidationPipe())
  @Post('users/login')
  async login(@Body('user') loginUserDto: UserDto): Promise<IUserRO> {
    const foundUser = await this.userService.findOne(loginUserDto);

    const errors = { message: 'User with given email/password not found' };
    if (!foundUser) {
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED);
    }

    if (foundUser.deleted) {
      throw new HttpException(
        {
          message:
            'This user have been deleted previously, please create a new user back again',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.userService.updateLatestLogin(foundUser);

    return this.userService.buildUserRO(
      new UserEntity(foundUser.username, foundUser.password),
    );
  }
}
