# Dockerfile
FROM oven/bun:latest
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

EXPOSE 3001
CMD ["bun", "x", "serve", "-s", "build", "-l", "3001"]
