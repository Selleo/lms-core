import { Injectable, NotImplementedException } from "@nestjs/common";

@Injectable()
export class TestConfigService {
  constructor() {}

  public async setup() {
    throw new NotImplementedException();
  }

  public async teardown() {
    throw new NotImplementedException();
  }
}
