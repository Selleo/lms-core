import { APP_GUARD } from "@nestjs/core";
import { AuthModule } from "./auth/auth.module";
import { CategoriesModule } from "./categories/categories.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DrizzlePostgresModule } from "@knaadh/nestjs-drizzle-postgres";
import { JwtAuthGuard } from "./common/guards/jwt-auth-guard";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
import * as schema from "./storage/schema";
import database from "./common/configuration/database";
import jwtConfig from "./common/configuration/jwt";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [database, jwtConfig],
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
            expiresIn: configService.get<string>(
              "JWT_EXPIRATION_TIME",
              "15min",
            ),
          },
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
