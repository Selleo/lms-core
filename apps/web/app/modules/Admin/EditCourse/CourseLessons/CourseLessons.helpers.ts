import { match } from "ts-pattern";

export const mapItemType = (itemType: string | undefined): string =>
  match(itemType)
    .with("text_block", () => "Text")
    .with("video", () => "Video")
    .with("presentation", () => "Presentation")
    .with("question", () => "Quiz")
    .otherwise(() => "Quiz");

export const mapTypeToIcon = (itemType: string): string =>
  match(itemType)
    .with("text_block", () => "Text")
    .with("video", () => "Video")
    .with("presentation", () => "Presentation")
    .with("question", () => "Quiz")
    .otherwise(() => "Quiz");
