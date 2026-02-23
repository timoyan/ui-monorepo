import { Button } from "@/components/ui/button";
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
		</div>
	);
}

/**
 * Button fullWidth + disabled example
 */
export function ModuleBFullWidthDisabled() {
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
		</div>
	);
}
