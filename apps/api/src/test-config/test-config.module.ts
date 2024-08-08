import { Module } from "@nestjs/common";
import { TestConfigController } from "./api/test-config.controller";
import { TestConfigService } from "./test-config.service";

@Module({
  imports: [],
  controllers: [TestConfigController],
  providers: [TestConfigService],
  exports: [],
})
export class TestConfigModule {}
