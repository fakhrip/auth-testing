import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseApp: FirebaseApp,
  ) {}

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
      throw new HttpException({ errors }, 401);
    }

    return this.userService.buildUserRO(
      new User(foundUser.username, foundUser.password),
    );
  }
}