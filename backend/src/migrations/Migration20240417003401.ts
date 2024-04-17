import { Migration } from '@mikro-orm/migrations';

export class Migration20240417003401 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" uuid not null default gen_random_uuid(), "username" varchar(255) not null, "password" varchar(255) not null, "latest_login" timestamptz not null, "deleted" boolean not null default false, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "user" cascade;');
  }

}
