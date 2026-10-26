import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('DB_HOST', 'localhost'),
  port: Number(config.get('DB_PORT', 3306)),
  username: config.get<string>('DB_USER', 'root'),
  password: config.get<string>('DB_PASSWORD', ''),
  database: config.get<string>('DB_NAME', 'student_db'),
  autoLoadEntities: true,
  // Development only: auto-creates/updates tables from entities.
  // In production, turn this off and use TypeORM migrations instead.
  synchronize: true,
});
