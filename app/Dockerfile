FROM oven/bun:latest

COPY ./* ./

RUN bun install mongoose
RUN bun install elysia

EXPOSE 3000

CMD ["bun", "run", "index.ts"]