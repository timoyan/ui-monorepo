/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	reactStrictMode: true,
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
