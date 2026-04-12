FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build && pnpm prune --prod

FROM node:24-alpine AS runtime

ENV NODE_ENV=production
ENV MCP_TRANSPORT=http
ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /app

COPY --chown=1000:1000 package.json pnpm-lock.yaml ./
COPY --from=build --chown=1000:1000 /app/node_modules ./node_modules
COPY --from=build --chown=1000:1000 /app/dist ./dist

USER node

EXPOSE 8080

CMD ["node", "--enable-source-maps", "dist/index.js"]
