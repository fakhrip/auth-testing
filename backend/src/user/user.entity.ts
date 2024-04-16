import {
  Entity,
  PrimaryKey,
  Property,
  Opt,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { UserRepository } from './user.repository';
import { createHmac } from 'crypto';

@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository;

  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ hidden: true })
  username!: string;

  @Property({ hidden: true })
  password!: string;

  @Property({ onUpdate: () => new Date() })
  latestLogin = new Date();

  @Property({ default: false })
  deleted!: boolean & Opt;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = createHmac('sha256', password).digest('hex');
  }
}
