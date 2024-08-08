import { SetMetadata } from "@nestjs/common";

export const OnlyStaging = () => SetMetadata("onlyStaging", true);
