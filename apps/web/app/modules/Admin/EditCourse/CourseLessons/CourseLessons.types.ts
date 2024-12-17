export type LessonTypes =
  | "presentation"
  | "external_presentation"
  | "video"
  | "external_video"
  | undefined;

export enum DeleteContentType {
  Video = "video",
  Presentation = "presentation",
  Text = "text",
  Quiz = "quiz",
  Chapter = "chapter",
}
