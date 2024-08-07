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
        "lessonitems",
        "modules/Dashboard/LessonItems/LessonItems.layout.tsx"
      );
      route(
        "lessonitems/edit",
        "modules/Dashboard/LessonItems/Edit/EditLessonItems.layout.tsx",
        () => {
          route(
            ":id",
            "modules/Dashboard/LessonItems/Edit/[id]/LessonItemsEdit.page.tsx",
            {
              index: true,
            }
          );
        }
      );
      route(
        "lessonitems/add/video",
        "modules/Dashboard/LessonItems/Add/Video/LessonItemsAddVideo.page.tsx"
      );
      route(
        "lessonitems/add/text",
        "modules/Dashboard/LessonItems/Add/Text/LessonItemsAddText.page.tsx"
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
      route("lesson-items", "modules/Courses/LessonItems/LessonItems.page.tsx");
      route("users", "modules/Users/Users.page.tsx");
      route("categories", "modules/Courses/Categories/Categories.page.tsx");
    });
  });
};
