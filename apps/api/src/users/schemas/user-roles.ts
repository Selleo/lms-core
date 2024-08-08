export const userRoles = ["admin", "student", "tutor"] as const;

export const UserRoles: Record<UserRole, UserRole> = {
  admin: "admin",
  student: "student",
  tutor: "tutor",
};

export type UserRole = (typeof userRoles)[number];
