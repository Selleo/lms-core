interface LessonItem {
  id: string;
  title: string;
  status: "Published first" | "Draft first";
  type: "Text" | "Video";
  author: string;
  description?: string;
  video?: File | null | string;
}

interface DataWithOptions extends LessonItem {
  options: JSX.Element;
}
