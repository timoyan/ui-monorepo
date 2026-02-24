import { Button } from "@/components/ui/button";
import { useFlow } from "@/core/flow/useFlow";
import { useToast } from "@/core/toast";
import { ConnectedCartSample } from "@/features/cart";
import { css } from "@/styled-system/css";

const toastSectionStyles = css({
	display: "flex",
	flexDirection: "column",
	gap: "0.5rem",
	marginBottom: "1.5rem",
});

const flowStateRowStyles = css({
	display: "flex",
	gap: "0.5rem",
	flexWrap: "wrap",
	alignItems: "center",
	marginBottom: "1.5rem",
});

/**
 * Module C: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleC() {
	const { toast } = useToast();
	const { setModuleState } = useFlow();
	return (
		<div>
			<div className={toastSectionStyles}>
				<p className={css({ fontSize: "md", fontWeight: "semibold" })}>
					Toast from module (add to cart also shows toast)
				</p>
				<Button
					variant="primary"
					size="sm"
					onClick={() =>
						toast.success({
							title: "Hello from Module C",
							description: "Toast can be triggered from any module.",
						})
					}
				>
					Show toast
				</Button>
			</div>
			<div className={flowStateRowStyles}>
				<span className={css({ fontSize: "sm", color: "gray.600" })}>
					Flow state (module C):
				</span>
				<Button
					variant="secondary"
					size="sm"
					onClick={() =>
						setModuleState({
							name: "C",
							state: "INIT",
							message: "Module C (cart) reset",
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
							name: "C",
							state: "PROCESSING",
							message: "Loading cart…",
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
							name: "C",
							state: "COMPLETED",
							message: "Cart ready",
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
							name: "C",
							state: "FAILED",
							message: "Error from Module C",
						})
					}
				>
					Set FAILED
				</Button>
			</div>
			<ConnectedCartSample />
		</div>
	);
}
