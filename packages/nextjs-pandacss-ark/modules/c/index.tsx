import { Button } from "@/components/ui/button";
import { useToast } from "@/core/toast";
import { ConnectedCartSample } from "@/features/cart";
import { css } from "@/styled-system/css";

const toastSectionStyles = css({
	display: "flex",
	flexDirection: "column",
	gap: "0.5rem",
	marginBottom: "1.5rem",
});

/**
 * Module C: business module entry. Aggregate features and coordinate interactions here.
 */
export function ModuleC() {
	const { toast } = useToast();
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
			<ConnectedCartSample />
		</div>
	);
}
