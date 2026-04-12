ARG NODE_VERSION=24.12.0
ARG PNPM_VERSION=10.0.0

FROM node:${NODE_VERSION}-bookworm-slim AS base

ENV PNPM_HOME=/pnpm
ENV PATH=${PNPM_HOME}:${PATH}

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM dependencies AS build

COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM dependencies AS production-dependencies

RUN pnpm prune --prod

FROM node:${NODE_VERSION}-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=7400

WORKDIR /app

COPY --from=production-dependencies --chown=1000:1000 /app/node_modules ./node_modules
COPY --from=build --chown=1000:1000 /app/dist ./dist
COPY --from=build --chown=1000:1000 /app/package.json ./package.json

USER 1000:1000

EXPOSE 7400

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s --retries=3 CMD ["node", "-e", "const port=process.env.PORT||7400; fetch(`http://127.0.0.1:${port}/healthz`).then((response)=>process.exit(response.ok?0:1)).catch(()=>process.exit(1));"]

CMD ["node", "dist/src/server.js"]
