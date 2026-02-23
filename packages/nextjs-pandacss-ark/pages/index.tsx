import Head from "next/head";
import { ModuleContainer } from "@/components/layout/module-container";
import { cartApi } from "@/apis/cart";
import { useModuleAccordion } from "@/core/hooks";
import { NextReduxWrapper } from "@/core/store";
import {
	ModuleA,
	ModuleBFullWidthDisabled,
	ModuleBVariantSize,
	ModuleC,
} from "@/modules";
import { css } from "@/styled-system/css";

const containerStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "2rem",
	p: "2rem",
	minH: "100vh",
});

const headingStyles = css({
	fontSize: "2xl",
	fontWeight: "bold",
});

export default function Home() {
	const { getValue, getOnValueChange } = useModuleAccordion();

	return (
		<>
			<Head>
				<title>Next.js + PandaCSS + Ark UI</title>
			</Head>
			<main className={containerStyles}>
				<h1 className={headingStyles}>Next.js + PandaCSS + Ark UI</h1>
				<p className={css({ color: "gray.600" })}>
					Tech stack: Next.js · PandaCSS · Ark UI
				</p>

				<ModuleContainer
					moduleId="a"
					title="Accordion example"
					collapsible
					value={getValue("a")}
					onValueChange={getOnValueChange("a")}
				>
					<ModuleA />
				</ModuleContainer>

				<ModuleContainer
					moduleId="b-1"
					title="Button – variant + size"
					collapsible
					value={getValue("b-1")}
					onValueChange={getOnValueChange("b-1")}
				>
					<ModuleBVariantSize />
				</ModuleContainer>

				<ModuleContainer
					moduleId="b-2"
					title="Button – fullWidth + disabled"
					collapsible
					value={getValue("b-2")}
					onValueChange={getOnValueChange("b-2")}
				>
					<ModuleBFullWidthDisabled />
				</ModuleContainer>

				<ModuleContainer
					moduleId="c"
					title="Cart"
					asWrapper
					collapsible
					value={getValue("c")}
					onValueChange={getOnValueChange("c")}
				>
					<ModuleC />
				</ModuleContainer>
			</main>
		</>
	);
}

export const getServerSideProps = NextReduxWrapper.getServerSideProps(
	(store) => async () => {
		await store.dispatch(cartApi.endpoints.getCart.initiate());
		return { props: {} };
	},
);
