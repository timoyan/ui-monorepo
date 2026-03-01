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

## Multiple packages

When you have more than one package that produces tests and coverage, SonarCloud accepts **multiple report paths** (comma-separated). No need to merge reports into a single file.

**Example: explicit paths in `sonar-project.properties`**

```properties
# Comma-separated list of test execution reports
sonar.testExecutionReportPaths=packages/nextjs-pandacss-ark/test-result/sonar-report.xml,packages/other-pkg/test-result/sonar-report.xml

# Comma-separated list of LCOV coverage reports
sonar.javascript.lcov.reportPaths=packages/nextjs-pandacss-ark/test-result/coverage/lcov.info,packages/other-pkg/test-result/coverage/lcov.info
```

**Example: wildcards** (if your Sonar version supports them)

```properties
sonar.testExecutionReportPaths=packages/**/test-result/sonar-report.xml
sonar.javascript.lcov.reportPaths=packages/**/test-result/coverage/lcov.info
```

In CI, run `test:sonar` for each package (e.g. via `pnpm --filter "./packages/*" run test:sonar` or separate steps), then run the SonarScanner so it picks up all generated reports.
