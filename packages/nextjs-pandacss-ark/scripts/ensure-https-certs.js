const { existsSync } = require("node:fs");
const { join } = require("node:path");

const keyPath = join(process.cwd(), "certs", "local.timotest.com-key.pem");
const certPath = join(process.cwd(), "certs", "local.timotest.com.pem");

if (existsSync(keyPath) && existsSync(certPath)) {
	process.exit(0);
}

console.error("Missing HTTPS certs for dev:https:custom.");
console.error("Create them with mkcert (see README → Custom domain and MSW):");
console.error("");
console.error("  mkdir -p certs");
console.error(
	"  mkcert -key-file certs/local.timotest.com-key.pem -cert-file certs/local.timotest.com.pem local.timotest.com",
);
console.error("");
process.exit(1);
