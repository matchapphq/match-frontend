FROM oven/bun:1

WORKDIR /app

COPY package.json /app

RUN bun install

COPY . /app

RUN bun run build

EXPOSE 4173

CMD ["bun", "run", "preview"]
