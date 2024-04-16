import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      entities: ['dist/**/*.entity.js'],
      entitiesTs: ['src/**/*.entity.ts'],
      metadataProvider: TsMorphMetadataProvider,
      driver: PostgreSqlDriver,

      host: 'localhost',
      port: 3307,
      user: 'root',
      password: '',
      dbName: 'dbname',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
