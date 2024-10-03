import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ConditionalModule, ConfigModule, ConfigService } from "@nestjs/config";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import * as schema from "./storage/schema";
import database from "./common/configuration/database";
import jwtConfig from "./common/configuration/jwt";
import emailConfig from "./common/configuration/email";
import awsConfig from "./common/configuration/aws";
import s3Config from "./common/configuration/s3";
import stripeConfig from "./common/configuration/stripe";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { EmailModule } from "./common/emails/emails.module";
import { TestConfigModule } from "./test-config/test-config.module";
import { StagingGuard } from "./common/guards/staging.guard";
import { HealthModule } from "./health/health.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CoursesModule } from "./courses/courses.module";
import { LessonsModule } from "./lessons/lessons.module";
import { QuestionsModule } from "./questions/questions.module";
import { StudentCompletedLessonItemsModule } from "./studentCompletedLessonItem/studentCompletedLessonItems.module";
import { S3Module } from "./file/s3.module";
import { StripeClientModule } from "./stripe/stripeClient.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        database,
        jwtConfig,
        emailConfig,
        awsConfig,
        s3Config,
        stripeConfig,
      ],
      isGlobal: true,
    }),
    DrizzlePostgresModule.registerAsync({
      tag: "DB",
      useFactory(configService: ConfigService) {
        return {
          postgres: {
            url: configService.get<string>("database.url")!,
          },
          config: {
            schema: { ...schema },
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get<string>("jwt.secret")!,
          signOptions: {
            expiresIn: configService.get<string>("jwt.expirationTime"),
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    HealthModule,
    UsersModule,
    EmailModule,
    TestConfigModule,
    CategoriesModule,
    ConditionalModule.registerWhen(
      ScheduleModule.forRoot(),
      (env) => env.NODE_ENV !== "test",
    ),
    CoursesModule,
    LessonsModule,
    QuestionsModule,
    StudentCompletedLessonItemsModule,
    S3Module,
    StripeClientModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: StagingGuard,
    },
  ],
})
export class AppModule {}
