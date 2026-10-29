import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { databaseConfig } from './config/database.config';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { securityHeaders } from './common/middleware/security-headers.middleware';
import { CoursesModule } from './courses/courses.module';
import { StudentsModule } from './students/students.module';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    AuthModule,
    StudentsModule,
    CoursesModule,
    TeachersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Order matters: headers first, then logging, for every route.
    consumer.apply(securityHeaders, RequestLoggerMiddleware).forRoutes('*');
  }
}
