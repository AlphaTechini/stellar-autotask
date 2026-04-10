FROM node:24-alpine

WORKDIR /app

COPY package.json ./
RUN corepack enable && pnpm install --frozen-lockfile=false

COPY . .

CMD ["pnpm", "start"]
