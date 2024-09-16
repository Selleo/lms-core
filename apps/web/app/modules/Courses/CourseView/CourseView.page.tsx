import { MetaFunction } from "@remix-run/node";
import { CourseViewMainCard } from "./CourseViewMainCard";
import { LessonsList } from "./LessonsList";
import { useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Courses" }, { name: "description", content: "Courses" }];
};

export default function CoursesViewPage() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row h-full gap-6">
        <CourseViewMainCard
          isEnrolled={isEnrolled}
          setIsEnrolled={setIsEnrolled}
        />
        <LessonsList lessons={[]} isEnrolled={isEnrolled} />
      </div>
    </div>
  );
}
