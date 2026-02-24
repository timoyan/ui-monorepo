##  (2026-02-23)

### Features

* add nextjs pandacss ark package ([#29](https://github.com/timoyan/ui-monorepo/issues/29)) ([835ce38](https://github.com/timoyan/ui-monorepo/commit/835ce3850b517bab60d795e2ce068696caa11298))
* add Playwright for E2E testing ([20c33b4](https://github.com/timoyan/ui-monorepo/commit/20c33b448f6242decf7224fd48a24071896a7e10))
* add ui-react19 package with React 19 support ([6a59c7a](https://github.com/timoyan/ui-monorepo/commit/6a59c7a4eb4b8f7bf22b9f95a9f71e5012e30c4a))
* add vite-react-19 example app and fix ui build ([da6cb39](https://github.com/timoyan/ui-monorepo/commit/da6cb39ef4b76bfc4e4af25774d6b543c3f1efd5))
* add vite-react-app package and wire to workspace; chore(next): enable React Compiler in nextjs-19-app; chore: ignore Next.js .next outputs; deps: update lockfile ([0c7b799](https://github.com/timoyan/ui-monorepo/commit/0c7b79969712015476c6fe9bf9823734fd6005cd))
* configure UI library with Linaria CSS-in-JS and tree-shaking support ([9050e44](https://github.com/timoyan/ui-monorepo/commit/9050e44ac75dc249b0d477eaaccada4bb443a1a9))
* **e2e:** add test coverage for nextjs15, vite-react18, and vite-rea… ([#21](https://github.com/timoyan/ui-monorepo/issues/21)) ([8557076](https://github.com/timoyan/ui-monorepo/commit/8557076ba53643e0b181a2e45b0510cd071267d9))
* **module-library:** add Adyen credit card form component and Next.js integration ([#28](https://github.com/timoyan/ui-monorepo/issues/28)) ([7f444ea](https://github.com/timoyan/ui-monorepo/commit/7f444ea7d37935cf9dd381907185f8bac6508a31))
* **nextjs-pandacss-ark:** add local HTTPS dev with mkcert and fix mi… ([#37](https://github.com/timoyan/ui-monorepo/issues/37)) ([94066ff](https://github.com/timoyan/ui-monorepo/commit/94066fffceb937fb5e5b0e881bc8cc393c0952dd))
* **nextjs-pandacss-ark:** add next-redux-wrapper, SSR store, and unit test guide ([#41](https://github.com/timoyan/ui-monorepo/issues/41)) ([be6d1c3](https://github.com/timoyan/ui-monorepo/commit/be6d1c3a76927ce85265e4665a46143f6777642c))
* output pure ES modules and fix CSS file paths ([5fa1066](https://github.com/timoyan/ui-monorepo/commit/5fa10663114b80208e890df04618e9ce1a21a18f))
* pnpm override verification tools ([#11](https://github.com/timoyan/ui-monorepo/issues/11)) ([41291d5](https://github.com/timoyan/ui-monorepo/commit/41291d53459ebdbec903db723a11e16e2887c412))
* **toast:** add registry-based toast with useToast and AppToaster ([#40](https://github.com/timoyan/ui-monorepo/issues/40)) ([ab41061](https://github.com/timoyan/ui-monorepo/commit/ab4106124a06021bc1c640d78e58757a939e97ad))
* **ui-packages:** add storybook with component stories ([#19](https://github.com/timoyan/ui-monorepo/issues/19)) ([58f5ad5](https://github.com/timoyan/ui-monorepo/commit/58f5ad59212d58a4dc5d69fd2dbb33151fa1aec0))
* **ui-react18:** add Modal component with unit tests ([#13](https://github.com/timoyan/ui-monorepo/issues/13)) ([899da56](https://github.com/timoyan/ui-monorepo/commit/899da56f14b6f50ab62adb1a396664e33639f03a))
* **ui-react18:** add toast notification component ([#17](https://github.com/timoyan/ui-monorepo/issues/17)) ([38dd3c8](https://github.com/timoyan/ui-monorepo/commit/38dd3c8079990b78a14802a30b91ad5270421b34))
* **ui:** add aggregated CSS entry and consume in Next.js 19 app ([f70638a](https://github.com/timoyan/ui-monorepo/commit/f70638a0e65fb4f622e67f0d483ad3baa25c812c))
* **ui:** add module layout, accordion hook and expand test coverage ([#31](https://github.com/timoyan/ui-monorepo/issues/31)) ([0f54a69](https://github.com/timoyan/ui-monorepo/commit/0f54a694b1b32383fb0a792a9c9db07bb31b69c6))
* **ui:** migrate to TypeScript, emit d.ts, stable filenames, and build-time aggregated CSS\n\n- Add TS configs and typings for ui Button/Card; emit declarations to build-types\n- Update exports to include types; ignore build-types and tsbuildinfo\n- Webpack: remove contenthash, add AggregateCssPlugin to produce build/main/main.css\n- Vite app + Next 18/19: TS migration, types resolution fixes (bundler), react types\n- Add next-env.d.ts and clean tsconfigs ([fb3ee87](https://github.com/timoyan/ui-monorepo/commit/fb3ee87adab30b70c43592d57a9bd4e17930a8fe))
* **workspace:** add nextjs-18-app and nextjs-19-app consuming local ui package\n\n- nextjs-18-app (React 18 + Next 14, pages router)\n- nextjs-19-app (React 19 + Next 15, app router)\n- both import ui/build Button/Card JS & CSS via workspace:* dependency\n- rename ui package name to 'ui' ([c13c2bb](https://github.com/timoyan/ui-monorepo/commit/c13c2bbc920e2545ad1174af526c5f803f2b240a))

### Bug Fixes

* **build:** isolate React types and stabilize webpack configs ([bbb867b](https://github.com/timoyan/ui-monorepo/commit/bbb867b46ae91452746bab373a8d3ec7b20df688))
* **ci:** reorder build steps to build UI packages before dependent apps ([#4](https://github.com/timoyan/ui-monorepo/issues/4)) ([1d7c551](https://github.com/timoyan/ui-monorepo/commit/1d7c55125dd2d0261a0c67ffb98b605cd2f8ccd8))
* **deps:** add pnpm overrides for Dependabot security alerts ([#39](https://github.com/timoyan/ui-monorepo/issues/39)) ([64a4fee](https://github.com/timoyan/ui-monorepo/commit/64a4fee7e8d299d5eb9aa83339c3cad2faf27e29))
* **deps:** remove npm package-lock.json and add to gitignore ([#26](https://github.com/timoyan/ui-monorepo/issues/26)) ([a9e1209](https://github.com/timoyan/ui-monorepo/commit/a9e1209db7de3202c0c1d48fd00b7e1b3e86b3a5))
* **module-library:** harden test-server path resolution and fix XSS ([#36](https://github.com/timoyan/ui-monorepo/issues/36)) ([b8dad48](https://github.com/timoyan/ui-monorepo/commit/b8dad48e28e9b70dc6f39a9169cb60ae495d4cae))
* **packages:** use ui-react19 for React 19 packages ([#12](https://github.com/timoyan/ui-monorepo/issues/12)) ([9750618](https://github.com/timoyan/ui-monorepo/commit/9750618258621d4a1800b4e02889d0cec388a8f8))
* **security:** add npm overrides to ensure safe dependency versions ([#8](https://github.com/timoyan/ui-monorepo/issues/8)) ([88d45e7](https://github.com/timoyan/ui-monorepo/commit/88d45e7952e657f5c94c42a5ad9158d3693aed01))
* **security:** address CVE-2024-51757 by upgrading happy-dom ([4728353](https://github.com/timoyan/ui-monorepo/commit/472835398ad328f10e2bd99ac289241942b40fba))
* **security:** correct happy-dom minimum version to 20.0.2 ([5518c0f](https://github.com/timoyan/ui-monorepo/commit/5518c0f15bba90f3a15b1538e04087b53482fdf3))
* **security:** fix glob CLI command injection vulnerability ([#5](https://github.com/timoyan/ui-monorepo/issues/5)) ([cbd570c](https://github.com/timoyan/ui-monorepo/commit/cbd570c9ca087e0d2fc5e2a701d25b7a20aad887))
* **security:** fix webpack-dev-server source code disclosure vulnerabilities ([#7](https://github.com/timoyan/ui-monorepo/issues/7)) ([819ebc2](https://github.com/timoyan/ui-monorepo/commit/819ebc2fab29bbf9ee17d4f13ca71bd4ba654bab))
* **security:** resolve esbuild CORS vulnerability GHSA-67mh-4wv8-2f99 ([#6](https://github.com/timoyan/ui-monorepo/issues/6)) ([1b96417](https://github.com/timoyan/ui-monorepo/commit/1b96417bc0ccab0e5ce32af4acdd4cea260906b7)), closes [#7](https://github.com/timoyan/ui-monorepo/issues/7)
* **security:** update esbuild to safe version in ui-react18 package-lock ([#9](https://github.com/timoyan/ui-monorepo/issues/9)) ([5362c83](https://github.com/timoyan/ui-monorepo/commit/5362c837465ae6cb197b0c8659e25aebd92689fe))
* set HOME=/root for Firefox in Playwright container ([6004531](https://github.com/timoyan/ui-monorepo/commit/600453133d98d360f6af38251e0a3f52de10918d))
* use jammy tag for Playwright Docker image ([83953bf](https://github.com/timoyan/ui-monorepo/commit/83953bf6946cca1ad0ccd95ea753519dcf65c78c))
* use latest tag for Playwright Docker image ([187a029](https://github.com/timoyan/ui-monorepo/commit/187a02986e51d505e80836063d6e94244ea150e3))

### Performance Improvements

* optimize Playwright CI with Docker image ([b7b93c2](https://github.com/timoyan/ui-monorepo/commit/b7b93c29441d44f449e86f4af410fd5b33a8a571))
