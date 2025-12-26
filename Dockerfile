# Build stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Build argument for API URL (Vite needs this at build time)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

# Production stage with nginx (proxies /api to backend)
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3001
CMD ["nginx", "-g", "daemon off;"]
