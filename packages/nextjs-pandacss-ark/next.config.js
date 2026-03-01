/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	reactStrictMode: true,
	// Set only in local dev via .env.local (e.g. BASE_PATH=/my-app). Other envs leave it unset.
	...(process.env.BASE_PATH && { basePath: process.env.BASE_PATH }),
	async headers() {
		return [
			{
				source: "/api/msw/worker",
				headers: [{ key: "Service-Worker-Allowed", value: "/" }],
			},
		];
	},
};

module.exports = nextConfig;
