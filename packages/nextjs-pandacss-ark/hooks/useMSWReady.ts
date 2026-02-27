import { useEffect, useState } from "react";
import { devOptions } from "@/mocks/config";

/**
 * Starts the MSW worker when enabled and returns whether it is ready.
 * In environments where MSW is enabled (development or when NEXT_PUBLIC_ENABLE_MSW=1),
 * wait for this before rendering so the first API requests are mocked.
 * Initial state is false when MSW is enabled to avoid hydration mismatch;
 * other environments use true so the app renders immediately.
 */
export function useMSWReady(): boolean {
	const isMswEnabled =
		process.env.NODE_ENV === "development" ||
		process.env.NEXT_PUBLIC_ENABLE_MSW === "1";

	const [ready, setReady] = useState(() => !isMswEnabled);

	useEffect(() => {
		if (!isMswEnabled || typeof window === "undefined") {
			return;
		}
		import("@/mocks/browser")
			.then(({ worker }) =>
				worker.start({
					serviceWorker: {
						url: "/api/msw/worker",
						options: { scope: "/" },
					},
					...devOptions,
				}),
			)
			.then(() => setReady(true))
			.catch((error) => {
				// Silently handle worker start failures
				// The ready state remains false, which prevents rendering
				// until the worker is successfully started
				console.error("Failed to start MSW worker:", error);
			});
	}, [isMswEnabled]);

	return ready;
}
