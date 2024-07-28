FROM node:18

WORKDIR /app

COPY . .

RUN npm i -g pnpm
RUN apt update && apt install -y protobuf-compiler
RUN pnpm install

EXPOSE 8080 3000

CMD ["pnpm", "run", "dev"]
