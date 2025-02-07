FROM node:20.15.0-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ARG VITE_STRIPE_PUBLISHABLE_KEY
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY
RUN npm install -g pnpm@9.15.2

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN pnpm build --filter=web
# TODO: Move pnpm deploy to turbo prune workflow
RUN pnpm deploy --filter=web pnpm-deploy-output --prod

RUN npm run build

FROM nginx:1.27.1
COPY ./apps/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/apps/web/build/client /usr/share/nginx/html
