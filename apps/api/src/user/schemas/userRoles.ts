export const userRoles = ["admin", "student", "teacher"] as const;

export const USER_ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  TEACHER: "teacher",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
