### Apps and Packages

- apps
  - `api`: a NestJS backend application working as API
  - `web`: a Vite Remix SPA
  - `reverse-proxy`: for domains and https during development
- packages
  - `email-templates`: a package for email templates
  - `eslint-config`: a package for eslint configuration
  - `typescript-config`: a package for typescript configuration

### Install

To start with the setup make sure you have the correct NodeJS version stated in [.tool-versions](./.tool-versions).
For the node versioning we recommend [asdf](https://asdf-vm.com/). At the time of writing this readme the version is `20.15.0`

After these steps, run the following command

```sh
pnpm install
```

Now to configure our reverse proxy we need to install [Caddy](https://caddyserver.com/docs/install#homebrew-mac). You
can do this using `homebrew` on mac.

> [!IMPORTANT]  
> First run has to be run by hand to configure caddy. Later on it will automatically
> start with the app start script.

To do that proceed with the following

```sh
cd ./apps/reverse-proxy
caddy run
```

After running caddy proceed with the on screen instructions.

Last step is to go our NestJS app and configure its environmental variables and docker.
So being in `guidebook/apps/api` run the following command

```sh
cp .env.example .env
docker-compose up -d
```

### Migrations

Once the docker is up and running we need to run the migrations. To do that run the following command

```sh
pnpm db:migrate
```

### Develop

Now in the main directory once you run `pnpm dev` it will run everything in parallel
and you should be abble to acces your app on the following adresses!

| Service | URL                                                                          |
| ------- | ---------------------------------------------------------------------------- |
| Web app | [ https://app.guidebook.localhost ](https://app.guidebook.localhost)         |
| Api     | [https://api.guidebook.localhost ](https://api.guidebook.localhost)          |
| Swagger | [ https://api.guidebook.localhost/api ](https://api.guidebook.localhost/api) |

### Commands

- #### Database

  - generate migration

    ```sh
    pnpm db:generate
    ```

  - run migrations

    ```sh
    pnpm db:migrate
    ```

> [!IMPORTANT]
> Once migration is generated chagne its name to something more descriptive.
> Also make sure to change the migration name in [\_journal.json](apps/api/src/storage/migrations/meta/_journal.json) file under the `tag` key.

- #### HTTP Client

  To generate the http client run the following command.

  ```sh
  pnpm generate:client
  ```

  This command automates the process of creating a TypeScript client for the API based on the Swagger specification.

- #### Email Templates

  Email templates are generated on every start of turborepo. To generate them manually run the following command in `packages/email-templates`.

  ```sh
  pnpm build
  ```

  The mailhog service is available at [mailbox.guidebook.localhost](https://mailbox.guidebook.localhost)

- #### Testing
  - **Frontend**:
    ```sh
    pnpm test:web
    ```
    ```sh
    pnpm test:web:e2e
    ```
  - **Backend**:
    ```sh
    pnpm test:api
    ```
    ```sh
    pnpm test:api:e2e
    ```

## Legal notice

This project was generated using [Selleo LMS](https://github.com/Selleo/lms-core) which is licensed under the MIT license.

## About Selleo

![selleo](https://raw.githubusercontent.com/Selleo/selleo-resources/master/public/github_footer.png)

Software development teams with an entrepreneurial sense of ownership at their core delivering great digital products and building culture people want to belong to. We are a community of engaged co-workers passionate about crafting impactful web solutions which transform the way our clients do business.

All names and logos for [Selleo](https://selleo.com/about) are trademark of Selleo Labs Sp. z o.o. (formerly Selleo Sp. z o.o. Sp.k.)
