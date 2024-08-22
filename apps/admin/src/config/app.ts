import AdminJSExpress, { AuthenticationContext } from "@adminjs/express";
import { Database, Resource } from "@adminjs/sql";
import AdminJS from "adminjs";
import bcrypt from "bcrypt";
import Connect from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { credentialsConfigOptions } from "../AdminResourceOptions/credentials.js";
import { usersConfigOptions } from "../AdminResourceOptions/users.js";
import { env } from "../env.js";
import { DatabaseService } from "./database.js";

const authenticate = async (
  email: string,
  password: string,
  { req }: AuthenticationContext,
) => {
  const db = req.app.get("databaseService");
  const usersResource = db.getResource("users");
  const credentialsResource = db.getResource("credentials");

  const user = await usersResource.knex
    .select("*")
    .from(usersResource.tableName)
    .where({ email: email })
    .first();

  if (user) {
    const userCredentials = await credentialsResource.knex
      .select("*")
      .from(credentialsResource.tableName)
      .where({ user_id: user.id })
      .first();

    if (
      userCredentials &&
      (await bcrypt.compare(password, userCredentials.password))
    ) {
      if (user.role === "admin" || user.role === "tutor") {
        return {
          email: user.email,
          id: user.id,
          role: user.role,
          firstName: user.first_name,
          lastName: user.last_name,
        };
      } else {
        console.log(
          `User ${user.email} tried to log in but doesn't have the required role.`,
        );
        return null;
      }
    }
  }
  return null;
};

export class AdminApp {
  private app: express.Application;
  private db: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.app = express();
    this.db = databaseService;
    this.app.set("databaseService", databaseService);
  }

  async init() {
    AdminJS.registerAdapter({ Database, Resource });

    const admin = new AdminJS({
      resources: [
        {
          resource: this.db.getResource("users"),
          ...usersConfigOptions,
        },
        {
          resource: this.db.getResource("categories"),
          options: {},
        },
        {
          resource: this.db.getResource("credentials"),
          ...credentialsConfigOptions,
        },
      ],
    });

    const ConnectSession = Connect(session);
    const sessionStore = new ConnectSession({
      conObject: {
        connectionString: env.DATABASE_URL,
        ssl: process.env.NODE_ENV === "production",
      },
      tableName: "session",
      createTableIfMissing: true,
    });

    this.app.get("/admin/healthcheck", (_req, res) => {
      res.send("OK").status(200);
    });

    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
      admin,
      {
        authenticate,
        cookieName: "adminjs",
        cookiePassword: env.SESSION_SECRET,
      },
      null,
      {
        store: sessionStore,
        resave: true,
        saveUninitialized: true,
        secret: env.SESSION_SECRET,
        cookie: {
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
        },
        name: "adminjs",
      },
    );

    this.app.use(admin.options.rootPath, adminRouter);

    this.app.listen(8888, () => {
      console.log(
        `AdminJS started on https://admin.lms.localhost${admin.options.rootPath} or http://localhost:8888${admin.options.rootPath}`,
      );
    });
  }
}