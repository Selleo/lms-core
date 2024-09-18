import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Lesson" }, { name: "description", content: "lesson" }];
};

export default function LessonPage() {
  return <div className="text-2xl font-bold">Lesson page</div>;
}
