import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { EntityManager, wrap } from '@mikro-orm/core';
import { User } from './user.entity';
import { IUserRO } from './user.interface';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';
import { FirebaseApp } from 'src/util/firebase';
import { createHmac } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly firebaseApp: FirebaseApp,
    private readonly userRepository: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async findOne(dto: UserDto): Promise<User | null> {
    const findOneOptions = {
      username: dto.username,
      password: createHmac('sha256', dto.password).digest('hex'),
    };

    return this.userRepository.findOne(findOneOptions);
  }

  async findOneByid(id: string): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async findById(id: string): Promise<IUserRO> {
    const user = await this.findOneByid(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED);
    }

    if (user.deleted) {
      const errors = { User: ' have already been deleted' };
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED);
    }

    return this.buildUserRO(user);
  }

  async findByUsername(username: string): Promise<IUserRO> {
    const user = await this.userRepository.findOneOrFail({ username });
    return this.buildUserRO(user);
  }

  async create(dto: UserDto): Promise<IUserRO> {
    // check uniqueness of username
    const { username, password } = dto;
    const [foundUser, exists] = await this.userRepository.findAndCount({
      username,
    });

    // since username is unique, foundUser list should not be more than 1
    const possibleUser = foundUser?.[0];
    let user: User = null;

    if (!possibleUser || !possibleUser.deleted) {
      // error if user exist and its not deleted previously
      if (exists > 0) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { username: 'User with that username is already exist.' },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // create new user
      user = new User(username, password);
      const errors = await validate(user);

      if (errors.length > 0) {
        throw new HttpException(
          {
            message: 'Input data validation failed',
            errors: { username: 'Userinput is not valid.' },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // write the new user to db
      this.em.persist(user);
    } else {
      // change deleted status to false
      user = possibleUser;
      user.deleted = false;
    }

    if (!user) {
      throw new HttpException(
        {
          message: 'Something wrong happened, please try again later',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    await this.em.flush();
    return this.buildUserRO(user);
  }

  async buildUserRO(user: User): Promise<IUserRO> {
    const userRO = {
      username: user.username,
      token: await this.firebaseApp.createCustomToken(user.id),
    };

    return { user: userRO };
  }

  async updateLatestLogin(user: User): Promise<void> {
    user.latestLogin = new Date();
    await this.em.flush();
  }

  // Do soft deletion instead of removing from db
  async removeUser(user: User): Promise<void> {
    user.deleted = true;
    await this.em.flush();
  }
}
