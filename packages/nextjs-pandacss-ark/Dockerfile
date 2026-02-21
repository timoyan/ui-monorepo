# nextjs-pandacss-ark — standalone production image (minimal size)
# Uses Next.js output: 'standalone'. No full node_modules in image.
#
# Build (from repo root, with pnpm):
#   pnpm install
#   pnpm --filter nextjs-pandacss-ark build
#   docker build -f packages/nextjs-pandacss-ark/Dockerfile -t nextjs-pandacss-ark packages/nextjs-pandacss-ark
#
# Run: docker run -p 3000:3000 nextjs-pandacss-ark

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
	adduser --system --uid 1001 nextjs

# Standalone output (monorepo: server.js lives under packages/nextjs-pandacss-ark/)
COPY .next/standalone ./
COPY .next/static ./packages/nextjs-pandacss-ark/.next/static
RUN mkdir -p ./packages/nextjs-pandacss-ark/public

USER nextjs

EXPOSE 3000

CMD ["node", "packages/nextjs-pandacss-ark/server.js"]
