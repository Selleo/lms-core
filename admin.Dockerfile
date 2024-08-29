FROM node:20.15.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm build --filter=admin
# TODO: Move pnpm deploy to turbo prune workflow
RUN pnpm deploy --filter=admin pnpm-deploy-output --prod

FROM node:20.15.0-alpine
WORKDIR /app
COPY --from=base /app/pnpm-deploy-output /app

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT [ "/app/entrypoint.sh" ]
