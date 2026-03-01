# CI Best Practices (GitHub Actions & Bitbucket Pipelines)

This doc describes recommended CI setup for this repo: job order, caching, and example workflows for **GitHub Actions** and **Bitbucket Pipelines**. For SonarCloud report paths and multi-package setup, see [SONAR_TEST_REPORTS.md](./SONAR_TEST_REPORTS.md). The repo does not include `.github/workflows` by default; use this doc as a template when adding CI.

Use **Node.js >=22** in CI to match `engines` in `packages/nextjs-pandacss-ark` (`>=22.0.0`).

---

## General best practices


| Practice                                     | Why                                                                                                         |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Install before lint/test**                 | Lint and tests depend on `node_modules`; use a single install step and reuse it.                            |
| **Cache dependency installs**                | pnpm store / `node_modules` cache speeds up runs (especially with lockfile).                                |
| **Run tests with coverage when using Sonar** | Use `pnpm test:sonar` once: it runs unit tests and produces Sonar reports (no separate test + report step). |
| **Sonar after tests**                        | Run SonarScanner only after `test:sonar` so report paths exist.                                             |
| **Secrets in CI, not in repo**               | Use `SONAR_TOKEN`, `NPM_TOKEN`, etc. from repository/org secrets.                                           |
| **Fail fast**                                | Order: install → lint → type-check → test:sonar → build → Sonar (optional).                                 |
| **Build**                                    | Run the app build (e.g. Next.js) so CI fails if the project does not compile.                               |


---

## Recommended job order

1. **Install** – `pnpm install --frozen-lockfile`
2. **Lint** – `pnpm run lint` (and optionally `pnpm run format:check`)
3. **Type check** – `pnpm run type-check`
4. **Tests + reports** – `pnpm run test:sonar` (runs tests and writes Sonar test/coverage reports)
5. **Build** – `pnpm --filter nextjs-pandacss-ark run build` (or `pnpm --filter "./packages/*" run build` for multiple packages)
6. **Sonar analysis** (if used) – SonarScanner, after step 4 (reports) / step 5 (build)

---

## GitHub Actions

### Minimal: lint, type-check, test (no Sonar)

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Type check
        run: pnpm run type-check

      - name: Test (with coverage for Sonar)
        run: pnpm run test:sonar

      - name: Build
        run: pnpm --filter nextjs-pandacss-ark run build
```

### With SonarCloud

Add a step after tests; Sonar reports are already produced by `test:sonar`. Configure `SONAR_TOKEN` in repo secrets and (if needed) `sonar.organization` / `sonar.projectKey` in `sonar-project.properties` or as env vars.

```yaml
      # ... same steps up to "Test (with coverage for Sonar)" and "Build" ...

      - name: SonarCloud analysis
        uses: SonarSource/sonarcloud-github-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Caching pnpm store (optional)

To cache the pnpm store for faster installs:

```yaml
      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "pnpm"

      # Optional: cache pnpm store more explicitly (store is in ~/.local/share/pnpm/store by default)
      - name: Get pnpm store directory
        shell: bash
        run: echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - uses: actions/cache@v4
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-
```

### What not to cache

| Output | Cache? | Why |
|--------|--------|-----|
| **Sonar reports** (`test-result/sonar-report.xml`, `coverage/lcov.info`) | No | Generated fresh each run; SonarScanner reads them in the same job. If Sonar runs in a **separate job**, pass reports as **artifacts** to that job (see Bitbucket example), not as a cache. |
| **`.next`** (Next.js build output) | No | Each run should do a clean build to verify the project compiles. Caching `.next` across runs can hide build failures. If a later **step in the same pipeline** needs the build (e.g. deploy), pass `.next` as **artifacts** to that step, not as a cache for the next pipeline run. |

---

## Bitbucket Pipelines

### Minimal: lint, type-check, test (no Sonar)

```yaml
# bitbucket-pipelines.yml
definitions:
  caches:
    pnpm: ~/.local/share/pnpm/store

pipelines:
  default:
    - step:
        name: Lint, type-check, test
        image: node:22
        caches:
          - pnpm
        script:
          - corepack enable && corepack prepare pnpm@latest --activate
          - pnpm install --frozen-lockfile
          - pnpm run lint
          - pnpm run type-check
          - pnpm run test:sonar
          - pnpm --filter nextjs-pandacss-ark run build
```

### With SonarCloud

Use the SonarScanner image and run analysis after tests. Set `SONAR_TOKEN` in Repository / Pipeline settings → Repository variables (secured).

```yaml
pipelines:
  default:
    - step:
        name: Lint, type-check, test
        image: node:22
        caches:
          - pnpm
        script:
          - corepack enable && corepack prepare pnpm@latest --activate
          - pnpm install --frozen-lockfile
          - pnpm run lint
          - pnpm run type-check
          - pnpm run test:sonar
          - pnpm --filter nextjs-pandacss-ark run build
        artifacts:
          - packages/**/test-result/**

    - step:
        name: SonarCloud analysis
        image: sonarsource/sonarcloud-scan:latest
        script:
          - sonar-scanner
        variables:
          SONAR_TOKEN: $SONAR_TOKEN
```

If your Bitbucket image does not include pnpm, use a custom image or install it in the first step (e.g. `corepack enable && corepack prepare pnpm@9 --activate` and pin version in `package.json` engines if desired).

---

## Summary

- Use **one** `test:sonar` step to both validate tests and produce Sonar reports.
- Order: **install → lint → type-check → test:sonar → build → Sonar** (if used).
- Cache **pnpm** (and optionally the pnpm store) to speed up installs.
- Keep **Sonar tokens and other secrets** in CI only, not in the repo.
- For multiple packages, see [SONAR_TEST_REPORTS.md](./SONAR_TEST_REPORTS.md) for report paths and CI notes.

