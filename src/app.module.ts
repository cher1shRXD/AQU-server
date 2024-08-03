import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import * as config from 'config';


interface DbConfig {
  type:"mysql" | "mariadb" | "postgres" | "sqlite" | "mssql" | "oracle" | "mongodb" | "aurora-mysql";
  port:number;
  database:string;
  host:string;
  username:string;
  password:string;
  synchronize:boolean;
}

const dbConfig : DbConfig  = config.get('db');

@Module({
  imports: [
    BoardsModule,
    TypeOrmModule.forRoot({
      type: dbConfig.type,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: dbConfig.synchronize, 
    }),
    AuthModule,
    UploadModule,
  ],
})
export class AppModule {}
