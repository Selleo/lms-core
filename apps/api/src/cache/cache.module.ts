import KeyvRedis, { Keyv } from "@keyv/redis";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCache } from "cache-manager";

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      inject: [ConfigService],
      provide: "CACHE_MANAGER",
      useFactory: (configService: ConfigService) =>
        createCache({
          stores: [
            new Keyv({
              store: new KeyvRedis(configService.get<string>("REDIS_URL")),
            }),
          ],
        }),
    },
  ],
  exports: ["CACHE_MANAGER"],
})
export class CacheModule {}
