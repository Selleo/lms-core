export enum USER_ROLE {
  "admin" = "admin",
  "student" = "student",
  "tutor" = "tutor",
}

export type UserRole = keyof typeof USER_ROLE;
