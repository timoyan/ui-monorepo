import "@/global.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { NextReduxWrapper } from "@/core/store";
import { useMSWReady } from "@/hooks/useMSWReady";
import { AppToaster } from "@/components/ui/toast";

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

export default NextReduxWrapper.withRedux(App);
