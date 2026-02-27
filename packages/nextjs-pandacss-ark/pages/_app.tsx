import "@/global.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { AppToaster } from "@/components/ui/toast";
import { NextReduxWrapper } from "@/core/store";
import { useMSWReady } from "@/hooks/useMSWReady";

function AppContent(props: AppProps) {
	const { store, props: wrappedProps } =
		NextReduxWrapper.useWrappedStore(props);
	const { Component, pageProps } = wrappedProps;
	return (
		<Provider store={store}>
			<Component {...pageProps} />
			<AppToaster />
		</Provider>
	);
}

function App(props: AppProps) {
	const isMSWReady = useMSWReady();

	useEffect(() => {
		const isDev = process.env.NODE_ENV === "development";
		const isMswEnabled = process.env.NEXT_PUBLIC_ENABLE_MSW === "1";

		if (
			isDev ||
			isMswEnabled ||
			typeof window === "undefined" ||
			!("serviceWorker" in navigator)
		) {
			return;
		}

		navigator.serviceWorker
			.getRegistrations()
			.then((registrations) => {
				for (const registration of registrations) {
					const scriptURL = registration.active?.scriptURL;
					if (scriptURL?.includes("/api/msw/worker")) {
						registration.unregister();
					}
				}
			})
			.catch((error) => {
				console.error("Failed to unregister MSW service worker:", error);
			});
	}, []);

	if (!isMSWReady) {
		return (
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily: "system-ui, sans-serif",
					color: "#666",
				}}
			>
				Loading…
			</div>
		);
	}

	return <AppContent {...props} />;
}

export default App;
