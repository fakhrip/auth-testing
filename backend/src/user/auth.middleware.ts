import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from './user.service';
import { IUserData } from './user.interface';
import { FirebaseApp } from 'src/util/firebase';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly firebaseApp: FirebaseApp,
  ) {}

  async use(
    req: Request & { user?: IUserData & { id?: string } },
    res: Response,
    next: NextFunction,
  ) {
    const authHeaders = req.headers.authorization;
    if (
      authHeaders &&
      (authHeaders as string).split(' ')?.[0] == 'Bearer' &&
      (authHeaders as string).split(' ')?.[1]
    ) {
      const token = (authHeaders as string).split(' ')[1];
      const decodedToken = await this.firebaseApp.verifyIdToken(token);
      const user = await this.userService.findById(decodedToken.uid);

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
      }

      req.user = user.user;
      req.user.id = decodedToken.uid;
      next();
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}
