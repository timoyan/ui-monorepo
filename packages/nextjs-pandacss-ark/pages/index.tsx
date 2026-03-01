import Head from "next/head";
import { cartApi } from "@/apis/cart";
import { Button } from "@/components/atomics/button";
import { ModuleContainer } from "@/components/composed/layout/module-container";
import { CookieConfirmDialog } from "@/components/features/dialogs/CookieConfirmDialog";
import { CurrencySwitchDialog } from "@/components/features/dialogs/CurrencySwitchDialog";
import { MODULE_NAME_TO_ID, type ModuleName } from "@/core/constants/module";
import { initModulesState } from "@/core/flow/flowSlice";
import { getFlowInitFromRequest } from "@/core/flow/getFlowInitFromRequest";
import { useFlow } from "@/core/flow/useFlow";
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

const MODULE_TITLES: Record<ModuleName, string> = {
	A: "A",
	B1: "B1",
	B2: "B2",
	C: "C",
};

const MODULE_UI: Record<
	ModuleName,
	{ moduleId: string; title: string; children: React.ReactNode }
> = {
	A: {
		moduleId: MODULE_NAME_TO_ID.A,
		title: MODULE_TITLES.A,
		children: <ModuleA />,
	},
	B1: {
		moduleId: MODULE_NAME_TO_ID.B1,
		title: MODULE_TITLES.B1,
		children: <ModuleBVariantSize />,
	},
	B2: {
		moduleId: MODULE_NAME_TO_ID.B2,
		title: MODULE_TITLES.B2,
		children: <ModuleBFullWidthDisabled />,
	},
	C: {
		moduleId: MODULE_NAME_TO_ID.C,
		title: MODULE_TITLES.C,
		children: <ModuleC />,
	},
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
