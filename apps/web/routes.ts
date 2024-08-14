import {
  DefineRouteFunction,
  RouteManifest,
} from "@remix-run/dev/dist/config/routes";

export const routes: (
  defineRoutes: (
    callback: (defineRoute: DefineRouteFunction) => void
  ) => RouteManifest
) => RouteManifest | Promise<RouteManifest> = (defineRoutes) => {
  return defineRoutes((route) => {
    route("auth", "modules/Auth/Auth.layout.tsx", () => {
      route("login", "modules/Auth/Login.page.tsx", { index: true });
      route("register", "modules/Auth/Register.page.tsx");
    });
    route("", "modules/Dashboard/Dashboard.layout.tsx", () => {
      route("", "modules/Dashboard/Dashboard.page.tsx", {
        index: true,
      });

      route(
        "lesson-items",
        "modules/Courses/LessonItems/LessonItems.layout.tsx"
      );
      route(
        "lesson-items/:id/edit",
        "modules/Courses/LessonItems/EditLessonItem.page.tsx"
      );
      route(
        "lesson-items/add/video",
        "modules/Courses/LessonItems/LessonItemsAddVideo.page.tsx"
      );
      route(
        "lesson-items/add/text",
        "modules/Courses/LessonItems/LessonItemsAddText.page.tsx"
      );
      route(
        "settings",
        "modules/Dashboard/Settings/Settings.layout.tsx",
        () => {
          route("", "modules/Dashboard/Settings/Settings.page.tsx", {
            index: true,
          });
        }
      );
      route("courses", "modules/Courses/Courses.page.tsx", {
        index: true,
      });
      route("lessons", "modules/Courses/Lessons/Lessons.page.tsx");
      route("users", "modules/Users/Users.page.tsx");
      route("categories", "modules/Courses/Categories/Categories.page.tsx");
    });
  });
};
