// vite.config.ts
import { vitePlugin as remix } from "file:///Users/sensaz/Desktop/lms-core/node_modules/.pnpm/@remix-run+dev@2.9.2_@remix-run+react@2.9.2_react-dom@18.3.1_react@18.3.1__react@18.3.1_types_rguxfounnxy3vnfs4gqaulbuc4/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/sensaz/Desktop/lms-core/node_modules/.pnpm/vite@5.1.0_@types+node@20.14.14_terser@5.31.4/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/sensaz/Desktop/lms-core/node_modules/.pnpm/vite-tsconfig-paths@5.0.0_typescript@5.5.4_vite@5.1.0_@types+node@20.14.14_terser@5.31.4_/node_modules/vite-tsconfig-paths/dist/index.js";

// routes.ts
var routes = (defineRoutes) => {
  return defineRoutes((route) => {
    route("auth", "modules/Auth/Auth.layout.tsx", () => {
      route("login", "modules/Auth/Login.page.tsx", { index: true });
      route("register", "modules/Auth/Register.page.tsx");
    });
    route("", "modules/Dashboard/Dashboard.layout.tsx", () => {
      route("", "modules/Dashboard/Dashboard.page.tsx", {
        index: true
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
            index: true
          });
        }
      );
      route("courses", "modules/Courses/Courses.page.tsx", {
        index: true
      });
      route("lessons", "modules/Courses/Lessons/Lessons.page.tsx");
      route("users", "modules/Users/Users.page.tsx");
      route("categories", "modules/Courses/Categories/Categories.page.tsx");
    });
  });
};

// vite.config.ts
import path from "path";
import svgr from "file:///Users/sensaz/Desktop/lms-core/node_modules/.pnpm/vite-plugin-svgr@4.2.0_rollup@4.20.0_typescript@5.5.4_vite@5.1.0_@types+node@20.14.14_terser@5.31.4_/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/Users/sensaz/Desktop/lms-core/apps/web";
var vite_config_default = defineConfig({
  plugins: [
    svgr(),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        unstable_singleFetch: true
      },
      ssr: false,
      // SPA MODE - Might migrate to React Router 7
      routes
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {
      "~/*": path.resolve(__vite_injected_original_dirname, "./app")
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicm91dGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3NlbnNhei9EZXNrdG9wL2xtcy1jb3JlL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2Vuc2F6L0Rlc2t0b3AvbG1zLWNvcmUvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3NlbnNhei9EZXNrdG9wL2xtcy1jb3JlL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tIFwiLi9yb3V0ZXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgc3ZnciBmcm9tIFwidml0ZS1wbHVnaW4tc3ZnclwiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgc3ZncigpLFxuICAgIHJlbWl4KHtcbiAgICAgIGZ1dHVyZToge1xuICAgICAgICB2M19mZXRjaGVyUGVyc2lzdDogdHJ1ZSxcbiAgICAgICAgdjNfcmVsYXRpdmVTcGxhdFBhdGg6IHRydWUsXG4gICAgICAgIHYzX3Rocm93QWJvcnRSZWFzb246IHRydWUsXG4gICAgICAgIHVuc3RhYmxlX3NpbmdsZUZldGNoOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHNzcjogZmFsc2UsIC8vIFNQQSBNT0RFIC0gTWlnaHQgbWlncmF0ZSB0byBSZWFjdCBSb3V0ZXIgN1xuICAgICAgcm91dGVzLFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIn4vKlwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vYXBwXCIpLFxuICAgIH0sXG4gIH0sXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3NlbnNhei9EZXNrdG9wL2xtcy1jb3JlL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvc2Vuc2F6L0Rlc2t0b3AvbG1zLWNvcmUvYXBwcy93ZWIvcm91dGVzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9zZW5zYXovRGVza3RvcC9sbXMtY29yZS9hcHBzL3dlYi9yb3V0ZXMudHNcIjtpbXBvcnQge1xuICBEZWZpbmVSb3V0ZUZ1bmN0aW9uLFxuICBSb3V0ZU1hbmlmZXN0LFxufSBmcm9tIFwiQHJlbWl4LXJ1bi9kZXYvZGlzdC9jb25maWcvcm91dGVzXCI7XG5cbmV4cG9ydCBjb25zdCByb3V0ZXM6IChcbiAgZGVmaW5lUm91dGVzOiAoXG4gICAgY2FsbGJhY2s6IChkZWZpbmVSb3V0ZTogRGVmaW5lUm91dGVGdW5jdGlvbikgPT4gdm9pZFxuICApID0+IFJvdXRlTWFuaWZlc3RcbikgPT4gUm91dGVNYW5pZmVzdCB8IFByb21pc2U8Um91dGVNYW5pZmVzdD4gPSAoZGVmaW5lUm91dGVzKSA9PiB7XG4gIHJldHVybiBkZWZpbmVSb3V0ZXMoKHJvdXRlKSA9PiB7XG4gICAgcm91dGUoXCJhdXRoXCIsIFwibW9kdWxlcy9BdXRoL0F1dGgubGF5b3V0LnRzeFwiLCAoKSA9PiB7XG4gICAgICByb3V0ZShcImxvZ2luXCIsIFwibW9kdWxlcy9BdXRoL0xvZ2luLnBhZ2UudHN4XCIsIHsgaW5kZXg6IHRydWUgfSk7XG4gICAgICByb3V0ZShcInJlZ2lzdGVyXCIsIFwibW9kdWxlcy9BdXRoL1JlZ2lzdGVyLnBhZ2UudHN4XCIpO1xuICAgIH0pO1xuICAgIHJvdXRlKFwiXCIsIFwibW9kdWxlcy9EYXNoYm9hcmQvRGFzaGJvYXJkLmxheW91dC50c3hcIiwgKCkgPT4ge1xuICAgICAgcm91dGUoXCJcIiwgXCJtb2R1bGVzL0Rhc2hib2FyZC9EYXNoYm9hcmQucGFnZS50c3hcIiwge1xuICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICByb3V0ZShcbiAgICAgICAgXCJsZXNzb24taXRlbXNcIixcbiAgICAgICAgXCJtb2R1bGVzL0NvdXJzZXMvTGVzc29uSXRlbXMvTGVzc29uSXRlbXMubGF5b3V0LnRzeFwiXG4gICAgICApO1xuICAgICAgcm91dGUoXG4gICAgICAgIFwibGVzc29uLWl0ZW1zLzppZC9lZGl0XCIsXG4gICAgICAgIFwibW9kdWxlcy9Db3Vyc2VzL0xlc3Nvbkl0ZW1zL0VkaXRMZXNzb25JdGVtLnBhZ2UudHN4XCJcbiAgICAgICk7XG4gICAgICByb3V0ZShcbiAgICAgICAgXCJsZXNzb24taXRlbXMvYWRkL3ZpZGVvXCIsXG4gICAgICAgIFwibW9kdWxlcy9Db3Vyc2VzL0xlc3Nvbkl0ZW1zL0xlc3Nvbkl0ZW1zQWRkVmlkZW8ucGFnZS50c3hcIlxuICAgICAgKTtcbiAgICAgIHJvdXRlKFxuICAgICAgICBcImxlc3Nvbi1pdGVtcy9hZGQvdGV4dFwiLFxuICAgICAgICBcIm1vZHVsZXMvQ291cnNlcy9MZXNzb25JdGVtcy9MZXNzb25JdGVtc0FkZFRleHQucGFnZS50c3hcIlxuICAgICAgKTtcbiAgICAgIHJvdXRlKFxuICAgICAgICBcInNldHRpbmdzXCIsXG4gICAgICAgIFwibW9kdWxlcy9EYXNoYm9hcmQvU2V0dGluZ3MvU2V0dGluZ3MubGF5b3V0LnRzeFwiLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgcm91dGUoXCJcIiwgXCJtb2R1bGVzL0Rhc2hib2FyZC9TZXR0aW5ncy9TZXR0aW5ncy5wYWdlLnRzeFwiLCB7XG4gICAgICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJvdXRlKFwiY291cnNlc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9Db3Vyc2VzLnBhZ2UudHN4XCIsIHtcbiAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHJvdXRlKFwibGVzc29uc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9MZXNzb25zL0xlc3NvbnMucGFnZS50c3hcIik7XG4gICAgICByb3V0ZShcInVzZXJzXCIsIFwibW9kdWxlcy9Vc2Vycy9Vc2Vycy5wYWdlLnRzeFwiKTtcbiAgICAgIHJvdXRlKFwiY2F0ZWdvcmllc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9DYXRlZ29yaWVzL0NhdGVnb3JpZXMucGFnZS50c3hcIik7XG4gICAgfSk7XG4gIH0pO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBdVMsU0FBUyxjQUFjLGFBQWE7QUFDM1UsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxtQkFBbUI7OztBQ0duQixJQUFNLFNBSWlDLENBQUMsaUJBQWlCO0FBQzlELFNBQU8sYUFBYSxDQUFDLFVBQVU7QUFDN0IsVUFBTSxRQUFRLGdDQUFnQyxNQUFNO0FBQ2xELFlBQU0sU0FBUywrQkFBK0IsRUFBRSxPQUFPLEtBQUssQ0FBQztBQUM3RCxZQUFNLFlBQVksZ0NBQWdDO0FBQUEsSUFDcEQsQ0FBQztBQUNELFVBQU0sSUFBSSwwQ0FBMEMsTUFBTTtBQUN4RCxZQUFNLElBQUksd0NBQXdDO0FBQUEsUUFDaEQsT0FBTztBQUFBLE1BQ1QsQ0FBQztBQUVEO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQ0E7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFDQTtBQUFBLFFBQ0U7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUNBO0FBQUEsUUFDRTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQ0E7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFFBQ0EsTUFBTTtBQUNKLGdCQUFNLElBQUksZ0RBQWdEO0FBQUEsWUFDeEQsT0FBTztBQUFBLFVBQ1QsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQ0EsWUFBTSxXQUFXLG9DQUFvQztBQUFBLFFBQ25ELE9BQU87QUFBQSxNQUNULENBQUM7QUFDRCxZQUFNLFdBQVcsMENBQTBDO0FBQzNELFlBQU0sU0FBUyw4QkFBOEI7QUFDN0MsWUFBTSxjQUFjLGdEQUFnRDtBQUFBLElBQ3RFLENBQUM7QUFBQSxFQUNILENBQUM7QUFDSDs7O0FEakRBLE9BQU8sVUFBVTtBQUNqQixPQUFPLFVBQVU7QUFMakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsS0FBSztBQUFBLElBQ0wsTUFBTTtBQUFBLE1BQ0osUUFBUTtBQUFBLFFBQ04sbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsUUFDckIsc0JBQXNCO0FBQUEsTUFDeEI7QUFBQSxNQUNBLEtBQUs7QUFBQTtBQUFBLE1BQ0w7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsT0FBTyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
