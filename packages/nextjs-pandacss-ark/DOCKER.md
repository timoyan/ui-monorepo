# nextjs-pandacss-ark — Docker build (pnpm)

This package uses Next.js **standalone** output for Docker (~244MB), including only runtime files.

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- Run all commands from the **monorepo root**

---

## Build

```bash
# 1. Install dependencies
pnpm install

# 2. Build this package (produces .next/standalone and .next/static)
pnpm --filter nextjs-pandacss-ark build

# 3. Build Docker image
docker build \
  -f packages/nextjs-pandacss-ark/Dockerfile \
  -t nextjs-pandacss-ark \
  packages/nextjs-pandacss-ark
```

## Run

```bash
docker run -p 3000:3000 nextjs-pandacss-ark
```

Open http://localhost:3000 in your browser.

---

## Package script (optional)

From the package directory after a successful build:

```bash
cd packages/nextjs-pandacss-ark
pnpm run docker:standalone
```

---

## Environment variables (optional)

```bash
docker run -p 3000:3000 -e PORT=3000 -e HOSTNAME=0.0.0.0 nextjs-pandacss-ark
```

---

## Enable MSW mocks in Docker (option A)

To run the Docker image using the same mocked cart API as local development (no real backend required), enable MSW via an environment flag at build time:

```bash
# 1. From monorepo root, build with MSW enabled
NEXT_PUBLIC_ENABLE_MSW=1 pnpm --filter nextjs-pandacss-ark build

# 2. Build Docker image (uses the build output above)
docker build \
  -f packages/nextjs-pandacss-ark/Dockerfile \
  -t nextjs-pandacss-ark \
  packages/nextjs-pandacss-ark

# 3. Run container
docker run -p 3000:3000 nextjs-pandacss-ark
```

With `NEXT_PUBLIC_ENABLE_MSW=1`, the browser MSW worker is started even in production builds and the `/api/msw/worker` route stays available, so cart requests are served from the in-memory mock store instead of `http://test.com`.

---

## Troubleshooting

- **Cannot find module '/app/server.js'**  
  In a monorepo, standalone puts `server.js` under `packages/nextjs-pandacss-ark/`. The Dockerfile CMD is set to `node packages/nextjs-pandacss-ark/server.js`.
- **Large build context**  
  Use `.dockerignore` to exclude unneeded files; the image only needs `.next/standalone` and `.next/static`.
