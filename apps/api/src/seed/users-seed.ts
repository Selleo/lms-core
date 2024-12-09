import { faker } from "@faker-js/faker";

import { USER_ROLES } from "src/users/schemas/user-roles";

import type { UsersSeed } from "./seed.type";

export const students: UsersSeed = [
  {
    role: USER_ROLES.student,
    email: "student@example.com",
    firstName: faker.person.firstName(),
    lastName: "Student",
  },
  {
    role: USER_ROLES.student,
    email: "student2@example.com",
    firstName: faker.person.firstName(),
    lastName: "Student",
  },
  {
    role: USER_ROLES.student,
    email: "student3@example.com",
    firstName: faker.person.firstName(),
    lastName: "Student",
  },
];

export const admin: UsersSeed = [
  {
    role: USER_ROLES.admin,
    email: "admin@example.com",
    firstName: faker.person.firstName(),
    lastName: "Admin",
  },
];

export const teachers: UsersSeed = [
  {
    role: USER_ROLES.teacher,
    email: "teacher@example.com",
    firstName: faker.person.firstName(),
    lastName: "Teacher",
  },
  {
    role: USER_ROLES.teacher,
    email: "teacher2@example.com",
    firstName: faker.person.firstName(),
    lastName: "Teacher",
  },
];
