import { Button } from "@/components/atomics/button";
import { useFlow } from "@/core/flow/useFlow";
import { useToast } from "@/core/toast";
import { css } from "@/styled-system/css";

const rowStyles = css({
	display: "flex",
	gap: "1rem",
	flexWrap: "wrap",
	justifyContent: "center",
});

const sectionTitleStyles = css({
	fontSize: "md",
	fontWeight: "semibold",
	marginBottom: "0.5rem",
	width: "100%",
});

/**
 * Module B: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleB() {
	const { toast } = useToast();
	return (
		<>
			<ModuleBVariantSize />
			<ModuleBFullWidthDisabled />
			<ModuleBToastExamples toast={toast} />
		</>
	);
}

/**
 * Toast API examples: trigger different toast types from button clicks.
 * Use plain strings for title/description to avoid runtime issues with zag-js state.
 */
function ModuleBToastExamples({
	toast,
}: {
	toast: ReturnType<typeof useToast>["toast"];
}) {
	return (
		<div>
			<p className={sectionTitleStyles}>Toast examples</p>
			<div className={rowStyles}>
				<Button
					variant="primary"
					size="sm"
					onClick={() =>
						toast.success({
							title: "Success",
							description: "Operation completed successfully.",
						})
					}
				>
					Success
				</Button>
				<Button
					variant="danger"
					size="sm"
					onClick={() =>
						toast.error({
							title: "Error",
							description: "Something went wrong. Please try again.",
						})
					}
				>
					Error
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						toast.warning({
							title: "Warning",
							description: "Please check your input.",
						})
					}
				>
					Warning
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() =>
						toast.info({
							title: "Info",
							description: "Here is some information.",
						})
					}
				>
					Info
				</Button>
			</div>
		</div>
	);
}

/**
 * Button variant + size example
 */
export function ModuleBVariantSize() {
	const { setModuleState } = useFlow();
	return (
		<div>
			<div className={rowStyles}>
				<Button variant="primary" size="sm">
					Primary SM
				</Button>
				<Button variant="primary" size="md">
					Primary MD
				</Button>
				<Button variant="primary" size="lg">
					Primary LG
				</Button>
			</div>
			<div className={rowStyles}>
				<Button variant="secondary" size="sm">
					Secondary
				</Button>
				<Button variant="danger" size="md">
					Danger
				</Button>
				<Button variant="ghost" size="lg">
					Ghost
				</Button>
			</div>
			<div className={rowStyles}>
				<span className={css({ fontSize: "sm", color: "gray.600" })}>
					Flow state (module B1):
				</span>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B1",
							state: "INIT",
							message: "Module B1 (variant/size) reset",
						})
					}
				>
					Set INIT
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B1",
							state: "PROCESSING",
							message: "Processing from B1…",
						})
					}
				>
					Set PROCESSING
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B1",
							state: "COMPLETED",
							message: "Module B1 completed",
						})
					}
				>
					Set COMPLETED
				</Button>
				<Button
					variant="danger"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B1",
							state: "FAILED",
							message: "Error from Module B1",
						})
					}
				>
					Set FAILED
				</Button>
			</div>
		</div>
	);
}

/**
 * Button fullWidth + disabled example
 */
export function ModuleBFullWidthDisabled() {
	const { setModuleState } = useFlow();
	return (
		<div>
			<Button fullWidth variant="primary" size="lg">
				Full Width Primary
			</Button>
			<div className={rowStyles}>
				<Button variant="primary" disabled>
					Disabled Primary
				</Button>
				<Button variant="danger" disabled>
					Disabled Danger
				</Button>
			</div>
			<div className={rowStyles}>
				<span className={css({ fontSize: "sm", color: "gray.600" })}>
					Flow state (module B2):
				</span>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B2",
							state: "INIT",
							message: "Module B2 (fullWidth/disabled) reset",
						})
					}
				>
					Set INIT
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B2",
							state: "PROCESSING",
							message: "Loading from B2…",
						})
					}
				>
					Set PROCESSING
				</Button>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B2",
							state: "COMPLETED",
							message: "Module B2 completed",
						})
					}
				>
					Set COMPLETED
				</Button>
				<Button
					variant="danger"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "B2",
							state: "FAILED",
							message: "Error from Module B2",
						})
					}
				>
					Set FAILED
				</Button>
			</div>
		</div>
	);
}
