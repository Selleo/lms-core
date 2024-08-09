import { Controller, Post } from "@nestjs/common";
import { TestConfigService } from "../test-config.service";
import { OnlyStaging } from "src/common/decorators/staging.decorator";
import { Public } from "src/common/decorators/public.decorator";

@Controller("test-config")
export class TestConfigController {
  constructor(private testConfigService: TestConfigService) {}

  @Public()
  @Post("setup")
  @OnlyStaging()
  async setup(): Promise<void> {
    return this.testConfigService.setup();
  }

  @Post("teardown")
  @OnlyStaging()
  async teardown(): Promise<void> {
    return this.testConfigService.teardown();
  }
}
