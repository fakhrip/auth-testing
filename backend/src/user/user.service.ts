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

  async findById(id: string): Promise<IUserRO> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      const errors = { User: ' not found' };
      throw new HttpException({ errors }, 401);
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
    const exists = await this.userRepository.count({
      username,
    });

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
    const user = new User(username, password);
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
    await this.em.persistAndFlush(user);
    return this.buildUserRO(user);
  }

  async buildUserRO(user: User): Promise<IUserRO> {
    const userRO = {
      username: user.username,
      token: await this.firebaseApp.createCustomToken(user.id),
    };

    return { user: userRO };
  }
}
