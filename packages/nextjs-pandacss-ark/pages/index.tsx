import Head from "next/head";
import { cartApi } from "@/apis/cart";
import { ModuleContainer } from "@/components/layout/module-container";
import { Button } from "@/components/ui/button";
import { initModulesState } from "@/core/flow/flowSlice";
import { getFlowInitFromRequest } from "@/core/flow/getFlowInitFromRequest";
import type { ModuleName } from "@/core/flow/types";
import { useFlow } from "@/core/flow/useFlow";
import { NextReduxWrapper } from "@/core/store";
import { CookieConfirmDialog } from "@/features/dialogs/CookieConfirmDialog";
import { CurrencySwitchDialog } from "@/features/dialogs/CurrencySwitchDialog";
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

const MODULE_UI: Record<
	ModuleName,
	{ moduleId: string; title: string; children: React.ReactNode }
> = {
	A: { moduleId: "a", title: "A", children: <ModuleA /> },
	B1: { moduleId: "b-1", title: "B1", children: <ModuleBVariantSize /> },
	B2: {
		moduleId: "b-2",
		title: "B2",
		children: <ModuleBFullWidthDisabled />,
	},
	C: { moduleId: "c", title: "C", children: <ModuleC /> },
};

export default function Home() {
	const {
		activeModuleId,
		setActiveModuleId,
		moduleOrder,
		setCurrencySwitchDialogOpen,
	} = useFlow();

	const getAccordionValue = (moduleId: string) =>
		activeModuleId === moduleId ? ["module-content"] : [];

	const getOnValueChange =
		(moduleId: string) => (details: { value: string[] }) => {
			if (details.value.includes("module-content")) {
				setActiveModuleId(moduleId);
			} else {
				setActiveModuleId(null);
			}
		};

	return (
		<>
			<Head>
				<title>Next.js + PandaCSS + Ark UI</title>
			</Head>
			<main className={containerStyles}>
				<div
					className={css({
						display: "flex",
						alignItems: "center",
						gap: 4,
						flexWrap: "wrap",
					})}
				>
					<h1 className={headingStyles}>Next.js + PandaCSS + Ark UI</h1>
					<Button
						variant="secondary"
						size="sm"
						onClick={() => setCurrencySwitchDialogOpen(true)}
					>
						Currency
					</Button>
				</div>
				<p className={css({ color: "gray.600" })}>
					Tech stack: Next.js · PandaCSS · Ark UI
				</p>
				<CookieConfirmDialog />
				<CurrencySwitchDialog />

				{moduleOrder.map((name) => {
					const { moduleId, title, children } = MODULE_UI[name];
					return (
						<ModuleContainer
							key={moduleId}
							moduleId={moduleId}
							title={title}
							collapsible
							value={getAccordionValue(moduleId)}
							onValueChange={getOnValueChange(moduleId)}
							asWrapper={name === "C"}
						>
							{children}
						</ModuleContainer>
					);
				})}
			</main>
		</>
	);
}

export const getServerSideProps = NextReduxWrapper.getServerSideProps(
	(store) => async (context) => {
		const flowInit = getFlowInitFromRequest(context);
		store.dispatch(initModulesState(flowInit));
		await store.dispatch(cartApi.endpoints.getCart.initiate());
		return { props: {} };
	},
);
