export const userRoles = ["admin", "student", "tutor"] as const;

export const USER_ROLES = {
  admin: "admin",
  student: "student",
  tutor: "tutor",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
