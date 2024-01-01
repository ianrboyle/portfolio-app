import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PositionsModule } from './positions/positions.module';
import { User } from './users/user.entity';
import { Position } from './positions/position.entity';
import { APP_PIPE } from '@nestjs/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => {
        const isTestEnvironment = process.env.NODE_ENV === 'test';

        return {
          type: config.get<string>('DB_TYPE') as any,
          database: config.get<string>('DB_NAME'),
          host: isTestEnvironment ? undefined : config.get<string>('DB_HOST'),
          port: isTestEnvironment ? undefined : config.get<number>('DB_PORT'),
          username: isTestEnvironment
            ? undefined
            : config.get<string>('DB_USERNAME'),
          password: isTestEnvironment
            ? undefined
            : config.get<string>('DB_PASSWORD'),
          entities: [User, Position],
          autoLoadEntities: true,
          synchronize: true,
          retryAttempts: 10, // Set the number of retry attempts as per your requirements
          retryDelay: 3000,
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: process.env.DB_HOST,
    //   port: parseInt(process.env.DB_PORT),
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DB_DATABASE,
    //   entities: [User, Position],
    //   autoLoadEntities: true,
    //   synchronize: true,
    // }),
    UsersModule,
    PositionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['someKey'],
        }),
      )
      .forRoutes('*');
  }
}
