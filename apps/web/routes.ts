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
    route("", "modules/Landing/Landing.layout.tsx", () => {
      route("", "modules/Landing/Landing.page.tsx", {
        index: true,
      });
      route("/about", "modules/Landing/About.page.tsx");
      route("/pokemons", "modules/Landing/Pokemons.page.tsx");
      route("/pokemons/:id", "modules/Landing/Pokemon.page.tsx");
    });

    route("dashboard", "modules/Dashboard/Dashboard.layout.tsx", () => {
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
    });

    route("auth", "modules/Auth/Auth.layout.tsx", () => {
      route("login", "modules/Auth/Login.page.tsx");
      route("register", "modules/Auth/Register.page.tsx");
    });
  });
};
