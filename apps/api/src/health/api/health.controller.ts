import { Controller, Get } from "@nestjs/common";
import { HealthCheckService, HealthCheck } from "@nestjs/terminus";

import { Public } from "src/common/decorators/public.decorator";

@Controller("healthcheck")
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @Public()
  async check() {
    return this.health.check([]);
  }
}
