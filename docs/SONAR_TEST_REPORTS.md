# SonarCloud Test Reports

The project is configured to produce test execution and coverage reports that SonarCloud can read.

## Generated Reports

| Report type              | Format | Path                                                                 |
|--------------------------|--------|----------------------------------------------------------------------|
| Test execution (Generic Test Data) | XML    | `packages/nextjs-pandacss-ark/test-result/sonar-report.xml`          |
| Code coverage            | LCOV   | `packages/nextjs-pandacss-ark/test-result/coverage/lcov.info`       |

## Generating Reports Locally

From the project root:

```bash
pnpm test:sonar
```

Or from `packages/nextjs-pandacss-ark`:

```bash
pnpm test:sonar
```

Both commands produce the test execution and coverage reports above.

## SonarCloud / CI Setup

- Report paths are configured in **`sonar-project.properties`**:
  - `sonar.testExecutionReportPaths`
  - `sonar.javascript.lcov.reportPaths`
- Recommended CI order:
  1. Run `pnpm test:sonar` (or `pnpm --filter nextjs-pandacss-ark run test:sonar`)
  2. Then run the SonarScanner analysis

Set `sonar.organization` and `sonar.projectKey` in CI or in `sonar-project.properties`.
