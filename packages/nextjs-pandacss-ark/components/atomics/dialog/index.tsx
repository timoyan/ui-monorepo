import { Dialog as ArkDialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { styled } from "@/styled-system/jsx";

const StyledBackdrop = styled(ArkDialog.Backdrop, {
	base: {
		position: "fixed",
		inset: 0,
		bg: "blackAlpha.600",
		backdropFilter: "blur(2px)",
		zIndex: 100,
	},
});

const StyledPositioner = styled(ArkDialog.Positioner, {
	base: {
		position: "fixed",
		inset: 0,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 101,
		p: 4,
	},
});

const StyledContent = styled(ArkDialog.Content, {
	base: {
		w: "full",
		maxW: "md",
		bg: "white",
		borderRadius: "lg",
		boxShadow: "lg",
		p: 6,
		display: "flex",
		flexDirection: "column",
		gap: 4,
	},
});

const StyledTitle = styled(ArkDialog.Title, {
	base: {
		fontSize: "xl",
		fontWeight: "semibold",
		color: "gray.900",
	},
});

const StyledDescription = styled(ArkDialog.Description, {
	base: {
		fontSize: "md",
		color: "gray.600",
	},
});

const StyledCloseTrigger = styled(ArkDialog.CloseTrigger, {
	base: {
		alignSelf: "flex-end",
		mt: 2,
	},
});

export const Dialog = ArkDialog;
export const DialogBackdrop = StyledBackdrop;
export const DialogPositioner = StyledPositioner;
export const DialogContent = StyledContent;
export const DialogTitle = StyledTitle;
export const DialogDescription = StyledDescription;
export const DialogCloseTrigger = StyledCloseTrigger;
export { Portal as DialogPortal };
