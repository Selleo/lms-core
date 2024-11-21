import type { DefineRouteFunction, RouteManifest } from "@remix-run/dev/dist/config/routes";

export const routes: (
  defineRoutes: (callback: (defineRoute: DefineRouteFunction) => void) => RouteManifest,
) => RouteManifest | Promise<RouteManifest> = (defineRoutes) => {
  return defineRoutes((route) => {
    route("auth", "modules/Auth/Auth.layout.tsx", () => {
      route("login", "modules/Auth/Login.page.tsx", { index: true });
      route("register", "modules/Auth/Register.page.tsx");
      route("create-new-password", "modules/Auth/CreateNewPassword.page.tsx");
      route("password-recovery", "modules/Auth/PasswordRecovery.page.tsx");
    });
    route("", "modules/Dashboard/Dashboard.layout.tsx", () => {
      route("", "modules/Dashboard/Dashboard.page.tsx", {
        index: true,
      });
      route("course/:id", "modules/Courses/CourseView/CourseView.page.tsx");
      route("course/:courseId/lesson/:lessonId", "modules/Courses/Lesson/Lesson.page.tsx");
      route("settings", "modules/Dashboard/Settings/Settings.layout.tsx", () => {
        route("", "modules/Dashboard/Settings/Settings.page.tsx", {
          index: true,
        });
      });
      route("tutors/:id", "modules/Tutor/Tutor.page.tsx");
    });
    route("admin", "modules/Admin/Admin.layout.tsx", () => {
      route("courses", "modules/Admin/Courses/Courses.page.tsx", {
        index: true,
      });
      route("courses/new", "modules/Admin/Courses/CreateNewCourse.page.tsx");
      route("courses/:id", "modules/Admin/Courses/Course.page.tsx");
      route("users", "modules/Admin/Users/Users.page.tsx");
      route("users/:id", "modules/Admin/Users/User.page.tsx");
      route("users/new", "modules/Admin/Users/CreateNewUser.page.tsx");
      route("categories", "modules/Admin/Categories/Categories.page.tsx");
      route("categories/:id", "modules/Admin/Categories/Category.page.tsx");
      route("categories/new", "modules/Admin/Categories/CreateNewCategory.page.tsx");
      route("lessons", "modules/Admin/Lessons/Lessons.page.tsx");
      route("lessons/:id", "modules/Admin/Lessons/Lesson.page.tsx");
      route("lessons/new", "modules/Admin/Lessons/CreateNewLesson.page.tsx");
      route("lesson-items", "modules/Admin/LessonItems/LessonItems.page.tsx");
      route("lesson-items/new-file", "modules/Admin/LessonItems/CreateNewFile.page.tsx");
      route("lesson-items/new-text-block", "modules/Admin/LessonItems/CreateNewTextBlock.page.tsx");
      route("lesson-items/new-question", "modules/Admin/LessonItems/CreateNewQuestion.page.tsx");
      route("lesson-items/:id", "modules/Admin/LessonItems/LessonItem.page.tsx");
    });
  });
};
