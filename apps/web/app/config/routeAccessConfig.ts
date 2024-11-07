import { USER_ROLE } from "./userRoles";

import type { UserRole } from "./userRoles";

type RouteConfig = Record<string, UserRole[]>;

export const routeAccessConfig: RouteConfig = {
  "auth/login": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  "auth/register": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  "auth/create-new-password": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  "auth/password-recovery": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],

  // Client part
  "": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student], // Dashboard
  "course/:id": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  "course/:courseId/lesson/:lessonId": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  settings: [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],
  "tutors/:id": [USER_ROLE.admin, USER_ROLE.tutor, USER_ROLE.student],

  // Admin part
  "admin/courses": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/courses/new": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/courses/:id": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/users/*": [USER_ROLE.admin],
  "admin/categories": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/categories/:id": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/categories/new": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lessons": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lessons/:id": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lessons/new": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lesson-items": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lesson-items/new-file": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lesson-items/new-text-block": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lesson-items/new-question": [USER_ROLE.admin, USER_ROLE.tutor],
  "admin/lesson-items/:id": [USER_ROLE.admin, USER_ROLE.tutor],
} as const;
