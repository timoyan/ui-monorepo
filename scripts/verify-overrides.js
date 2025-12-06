#!/usr/bin/env node

/**
 * Script to verify that pnpm overrides are correctly applied and no stale versions exist.
 *
 * Usage:
 *   node scripts/verify-overrides.js [package-name]
 *
 * If package-name is provided, only that package is checked.
 * Otherwise, all packages in pnpm.overrides are checked.
 */

const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const rootPackageJson = JSON.parse(
	fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8"),
);

const overrides = rootPackageJson.pnpm?.overrides || {};

if (Object.keys(overrides).length === 0) {
	console.log("ℹ️  No pnpm overrides found in package.json");
	process.exit(0);
}

const packageToCheck = process.argv[2];

// Get packages to check
const packagesToCheck = packageToCheck
	? [packageToCheck]
	: Object.keys(overrides);

let hasErrors = false;
const results = [];

console.log("🔍 Verifying pnpm overrides...\n");

for (const pkg of packagesToCheck) {
	if (!overrides[pkg]) {
		console.log(`⚠️  ${pkg} is not in pnpm.overrides`);
		hasErrors = true;
		continue;
	}

	const expectedVersion = overrides[pkg];
	console.log(`Checking ${pkg} (expected: ${expectedVersion})...`);

	try {
		// Get all instances of the package
		const whyOutput = execSync(`pnpm why ${pkg}`, {
			encoding: "utf8",
			stdio: "pipe",
		});

		// Parse the output to find version numbers
		const versionMatches = whyOutput.match(/(\d+\.\d+\.\d+[^\s]*)/g);
		const versions = versionMatches ? [...new Set(versionMatches)] : [];

		if (versions.length === 0) {
			console.log(`  ⚠️  Could not determine version for ${pkg}`);
			results.push({ package: pkg, status: "unknown", versions: [] });
			continue;
		}

		// Check if all versions match the override
		const allMatch = versions.every((version) => {
			// For range overrides like ">=20.0.2", we need to check if version satisfies
			if (expectedVersion.startsWith(">=")) {
				const minVersion = expectedVersion.replace(">=", "");
				return compareVersions(version, minVersion) >= 0;
			}
			// For exact versions or other patterns, do simple string matching
			return version.includes(expectedVersion.replace(/[^0-9.]/g, ""));
		});

		if (allMatch) {
			console.log(
				`  ✅ All instances use compliant version(s): ${versions.join(", ")}`,
			);
			results.push({ package: pkg, status: "ok", versions });
		} else {
			console.log(
				`  ❌ Found non-compliant version(s): ${versions.join(", ")}`,
			);
			console.log(`     Expected: ${expectedVersion}`);
			results.push({ package: pkg, status: "error", versions });
			hasErrors = true;
		}

		// Show dependency tree
		console.log("  📦 Dependency tree:");
		const lines = whyOutput.split("\n").filter((line) => line.trim());
		for (const line of lines.slice(0, 10)) {
			if (line.includes(pkg)) {
				console.log(`     ${line.trim()}`);
			}
		}
		if (lines.length > 10) {
			console.log(`     ... (${lines.length - 10} more lines)`);
		}
		console.log("");
	} catch (error) {
		console.log(`  ❌ Error checking ${pkg}: ${error.message}`);
		hasErrors = true;
		results.push({ package: pkg, status: "error", versions: [] });
	}
}

// Summary
console.log("\n📊 Summary:");
for (const { package: pkg, status, versions } of results) {
	const icon = status === "ok" ? "✅" : status === "error" ? "❌" : "⚠️";
	console.log(
		`  ${icon} ${pkg}: ${status} ${versions.length > 0 ? `(${versions.join(", ")})` : ""}`,
	);
}

if (hasErrors) {
	console.log("\n❌ Some overrides are not correctly applied!");
	console.log("\n💡 To fix this:");
	console.log(
		"   1. Remove node_modules: rm -rf node_modules packages/*/node_modules",
	);
	console.log("   2. Remove lockfile: rm pnpm-lock.yaml");
	console.log("   3. Reinstall: pnpm install");
	console.log("   4. Verify again: node scripts/verify-overrides.js");
	process.exit(1);
} else {
	console.log("\n✅ All overrides are correctly applied!");
	process.exit(0);
}

/**
 * Simple version comparison (handles basic cases)
 * Returns: -1 if v1 < v2, 0 if v1 === v2, 1 if v1 > v2
 */
function compareVersions(v1, v2) {
	const parts1 = v1.split(".").map(Number);
	const parts2 = v2.split(".").map(Number);

	for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
		const part1 = parts1[i] || 0;
		const part2 = parts2[i] || 0;

		if (part1 < part2) return -1;
		if (part1 > part2) return 1;
	}

	return 0;
}
