import path from "path";
import AdminJSExpress, { AuthenticationContext } from "@adminjs/express";
import { Database, Resource } from "@adminjs/sql";
import AdminJS from "adminjs";
import bcrypt from "bcrypt";
import Connect from "connect-pg-simple";
import express from "express";
import session from "express-session";
import { coursesConfigOptions } from "../AdminResourceOptions/courses.js";
import { credentialsConfigOptions } from "../AdminResourceOptions/credentials.js";
import { filesConfigOptions } from "../AdminResourceOptions/files.js";
import { lessonFilesConfigOptions } from "../AdminResourceOptions/lesson-files.js";
import { lessonQuestionsConfigOptions } from "../AdminResourceOptions/lesson-questions.js";
import { lessonsConfigOptions } from "../AdminResourceOptions/lessons.js";
import { questionsConfigOptions } from "../AdminResourceOptions/questions.js";
import { textBlocksConfigOptions } from "../AdminResourceOptions/text-blocks.js";
import { usersConfigOptions } from "../AdminResourceOptions/users.js";
import { env } from "../env.js";
import { DatabaseService } from "./database.js";
import { Components, componentLoader } from "../components/components.js";
import { getGlobalCSS } from "@repo/ui";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { categoriesConfigOptions } from "../AdminResourceOptions/categories.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    .whereIn("role", ["admin", "tutor"])
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

    this.app.use(express.static(path.join(__dirname, "../../public")));

    const globalCSS = getGlobalCSS();

    const targetCssPath = path.join(process.cwd(), "public/global.css");

    writeFile(targetCssPath, globalCSS);

    const admin = new AdminJS({
      resources: [
        {
          resource: this.db.getResource("users"),
          options: {
            ...usersConfigOptions,
          },
        },
        {
          resource: this.db.getResource("categories"),
          ...categoriesConfigOptions,
        },
        {
          resource: this.db.getResource("credentials"),
          ...credentialsConfigOptions,
        },
        {
          resource: this.db.getResource("courses"),
          options: {
            ...coursesConfigOptions,
          },
        },
        {
          resource: this.db.getResource("files"),
          options: {
            ...filesConfigOptions,
          },
        },
        {
          resource: this.db.getResource("lesson_files"),
          options: {
            ...lessonFilesConfigOptions,
          },
        },
        {
          resource: this.db.getResource("lessons"),
          options: {
            ...lessonsConfigOptions,
          },
        },
        {
          resource: this.db.getResource("questions"),
          options: {
            ...questionsConfigOptions,
          },
        },
        {
          resource: this.db.getResource("lesson_questions"),
          options: {
            ...lessonQuestionsConfigOptions,
          },
        },
        {
          resource: this.db.getResource("text_blocks"),
          options: {
            ...textBlocksConfigOptions,
          },
        },
      ],
      dashboard: {
        component: Components.Dashboard,
      },
      rootPath: "/admin",
      componentLoader,
      assets: {
        styles: ["/global.css"],
      },
    });

    admin.watch();

    const ConnectSession = Connect(session);
    const sessionStore = new ConnectSession({
      conObject: {
        connectionString: env.DATABASE_URL,
      },
      tableName: "session",
      createTableIfMissing: true,
    });

    // allows express to parse X-Forwarded-Proto header (if set by the reverse proxy: Caddy, ALB etc.),
    // this is needed for the secure cookies to work
    this.app.set("trust proxy", true);
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
          httpOnly: true,
          secure: true,
        },
        name: "adminjs",
      },
    );

    this.app.use(admin.options.rootPath, adminRouter);
    this.app.get(admin.options.rootPath, (req, res) => {
      res.redirect(`/resources/users`);
    });
    this.app.listen(8888, () => {
      console.log(
        `AdminJS started on https://admin.lms.localhost${admin.options.rootPath} or http://localhost:8888${admin.options.rootPath}`,
      );
    });
  }
}
