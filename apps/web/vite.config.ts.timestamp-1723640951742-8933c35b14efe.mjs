// vite.config.ts
import { vitePlugin as remix } from "file:///Users/piotrpajak/workspace/lms-core/node_modules/.pnpm/@remix-run+dev@2.9.2_@remix-run+react@2.9.2_@types+node@20.14.14_typescript@5.5.4_vite@5.1.0/node_modules/@remix-run/dev/dist/index.js";
import { defineConfig } from "file:///Users/piotrpajak/workspace/lms-core/node_modules/.pnpm/vite@5.1.0_@types+node@20.14.14/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///Users/piotrpajak/workspace/lms-core/node_modules/.pnpm/vite-tsconfig-paths@5.0.0_typescript@5.5.4_vite@5.1.0/node_modules/vite-tsconfig-paths/dist/index.js";

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
      route("lesson-items", "modules/Courses/LessonItems/LessonItems.page.tsx");
      route("users", "modules/Users/Users.page.tsx");
      route("categories", "modules/Courses/Categories/Categories.page.tsx");
    });
  });
};

// vite.config.ts
import path from "path";
var __vite_injected_original_dirname = "/Users/piotrpajak/workspace/lms-core/apps/web";
var vite_config_default = defineConfig({
  plugins: [
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicm91dGVzLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3Bpb3RycGFqYWsvd29ya3NwYWNlL2xtcy1jb3JlL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcGlvdHJwYWphay93b3Jrc3BhY2UvbG1zLWNvcmUvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL3Bpb3RycGFqYWsvd29ya3NwYWNlL2xtcy1jb3JlL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdml0ZVBsdWdpbiBhcyByZW1peCB9IGZyb20gXCJAcmVtaXgtcnVuL2RldlwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5pbXBvcnQgeyByb3V0ZXMgfSBmcm9tIFwiLi9yb3V0ZXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZW1peCh7XG4gICAgICBmdXR1cmU6IHtcbiAgICAgICAgdjNfZmV0Y2hlclBlcnNpc3Q6IHRydWUsXG4gICAgICAgIHYzX3JlbGF0aXZlU3BsYXRQYXRoOiB0cnVlLFxuICAgICAgICB2M190aHJvd0Fib3J0UmVhc29uOiB0cnVlLFxuICAgICAgICB1bnN0YWJsZV9zaW5nbGVGZXRjaDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBzc3I6IGZhbHNlLCAvLyBTUEEgTU9ERSAtIE1pZ2h0IG1pZ3JhdGUgdG8gUmVhY3QgUm91dGVyIDdcbiAgICAgIHJvdXRlcyxcbiAgICB9KSxcbiAgICB0c2NvbmZpZ1BhdGhzKCksXG4gIF0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgXCJ+LypcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL2FwcFwiKSxcbiAgICB9LFxuICB9LFxufSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9waW90cnBhamFrL3dvcmtzcGFjZS9sbXMtY29yZS9hcHBzL3dlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3Bpb3RycGFqYWsvd29ya3NwYWNlL2xtcy1jb3JlL2FwcHMvd2ViL3JvdXRlcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcGlvdHJwYWphay93b3Jrc3BhY2UvbG1zLWNvcmUvYXBwcy93ZWIvcm91dGVzLnRzXCI7aW1wb3J0IHtcbiAgRGVmaW5lUm91dGVGdW5jdGlvbixcbiAgUm91dGVNYW5pZmVzdCxcbn0gZnJvbSBcIkByZW1peC1ydW4vZGV2L2Rpc3QvY29uZmlnL3JvdXRlc1wiO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzOiAoXG4gIGRlZmluZVJvdXRlczogKFxuICAgIGNhbGxiYWNrOiAoZGVmaW5lUm91dGU6IERlZmluZVJvdXRlRnVuY3Rpb24pID0+IHZvaWRcbiAgKSA9PiBSb3V0ZU1hbmlmZXN0XG4pID0+IFJvdXRlTWFuaWZlc3QgfCBQcm9taXNlPFJvdXRlTWFuaWZlc3Q+ID0gKGRlZmluZVJvdXRlcykgPT4ge1xuICByZXR1cm4gZGVmaW5lUm91dGVzKChyb3V0ZSkgPT4ge1xuICAgIHJvdXRlKFwiYXV0aFwiLCBcIm1vZHVsZXMvQXV0aC9BdXRoLmxheW91dC50c3hcIiwgKCkgPT4ge1xuICAgICAgcm91dGUoXCJsb2dpblwiLCBcIm1vZHVsZXMvQXV0aC9Mb2dpbi5wYWdlLnRzeFwiLCB7IGluZGV4OiB0cnVlIH0pO1xuICAgICAgcm91dGUoXCJyZWdpc3RlclwiLCBcIm1vZHVsZXMvQXV0aC9SZWdpc3Rlci5wYWdlLnRzeFwiKTtcbiAgICB9KTtcbiAgICByb3V0ZShcIlwiLCBcIm1vZHVsZXMvRGFzaGJvYXJkL0Rhc2hib2FyZC5sYXlvdXQudHN4XCIsICgpID0+IHtcbiAgICAgIHJvdXRlKFwiXCIsIFwibW9kdWxlcy9EYXNoYm9hcmQvRGFzaGJvYXJkLnBhZ2UudHN4XCIsIHtcbiAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHJvdXRlKFxuICAgICAgICBcInNldHRpbmdzXCIsXG4gICAgICAgIFwibW9kdWxlcy9EYXNoYm9hcmQvU2V0dGluZ3MvU2V0dGluZ3MubGF5b3V0LnRzeFwiLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgcm91dGUoXCJcIiwgXCJtb2R1bGVzL0Rhc2hib2FyZC9TZXR0aW5ncy9TZXR0aW5ncy5wYWdlLnRzeFwiLCB7XG4gICAgICAgICAgICBpbmRleDogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICAgIHJvdXRlKFwiY291cnNlc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9Db3Vyc2VzLnBhZ2UudHN4XCIsIHtcbiAgICAgICAgaW5kZXg6IHRydWUsXG4gICAgICB9KTtcbiAgICAgIHJvdXRlKFwibGVzc29uc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9MZXNzb25zL0xlc3NvbnMucGFnZS50c3hcIik7XG4gICAgICByb3V0ZShcImxlc3Nvbi1pdGVtc1wiLCBcIm1vZHVsZXMvQ291cnNlcy9MZXNzb25JdGVtcy9MZXNzb25JdGVtcy5wYWdlLnRzeFwiKTtcbiAgICAgIHJvdXRlKFwidXNlcnNcIiwgXCJtb2R1bGVzL1VzZXJzL1VzZXJzLnBhZ2UudHN4XCIpO1xuICAgICAgcm91dGUoXCJjYXRlZ29yaWVzXCIsIFwibW9kdWxlcy9Db3Vyc2VzL0NhdGVnb3JpZXMvQ2F0ZWdvcmllcy5wYWdlLnRzeFwiKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLGNBQWMsYUFBYTtBQUM3VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjs7O0FDR25CLElBQU0sU0FJaUMsQ0FBQyxpQkFBaUI7QUFDOUQsU0FBTyxhQUFhLENBQUMsVUFBVTtBQUM3QixVQUFNLFFBQVEsZ0NBQWdDLE1BQU07QUFDbEQsWUFBTSxTQUFTLCtCQUErQixFQUFFLE9BQU8sS0FBSyxDQUFDO0FBQzdELFlBQU0sWUFBWSxnQ0FBZ0M7QUFBQSxJQUNwRCxDQUFDO0FBQ0QsVUFBTSxJQUFJLDBDQUEwQyxNQUFNO0FBQ3hELFlBQU0sSUFBSSx3Q0FBd0M7QUFBQSxRQUNoRCxPQUFPO0FBQUEsTUFDVCxDQUFDO0FBQ0Q7QUFBQSxRQUNFO0FBQUEsUUFDQTtBQUFBLFFBQ0EsTUFBTTtBQUNKLGdCQUFNLElBQUksZ0RBQWdEO0FBQUEsWUFDeEQsT0FBTztBQUFBLFVBQ1QsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQ0EsWUFBTSxXQUFXLG9DQUFvQztBQUFBLFFBQ25ELE9BQU87QUFBQSxNQUNULENBQUM7QUFDRCxZQUFNLFdBQVcsMENBQTBDO0FBQzNELFlBQU0sZ0JBQWdCLGtEQUFrRDtBQUN4RSxZQUFNLFNBQVMsOEJBQThCO0FBQzdDLFlBQU0sY0FBYyxnREFBZ0Q7QUFBQSxJQUN0RSxDQUFDO0FBQUEsRUFDSCxDQUFDO0FBQ0g7OztBRGpDQSxPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osUUFBUTtBQUFBLFFBQ04sbUJBQW1CO0FBQUEsUUFDbkIsc0JBQXNCO0FBQUEsUUFDdEIscUJBQXFCO0FBQUEsUUFDckIsc0JBQXNCO0FBQUEsTUFDeEI7QUFBQSxNQUNBLEtBQUs7QUFBQTtBQUFBLE1BQ0w7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsT0FBTyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3hDO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
