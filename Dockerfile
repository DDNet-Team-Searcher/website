FROM node:18

WORKDIR /app

RUN npm i -g pnpm

COPY . .
RUN pnpm install

WORKDIR /app/packages/client
RUN pnpm install

WORKDIR /app/packages/server
RUN pnpm install

WORKDIR /app

EXPOSE 8080 3000

CMD ["pnpm", "run", "dev"]
