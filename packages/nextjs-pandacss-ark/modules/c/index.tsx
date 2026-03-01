import { useCallback, useState } from "react";
import type { CartItem as ApiCartItem } from "@/apis/cart";
import {
	useAddToCartMutation,
	useGetCartQuery,
	useRemoveFromCartMutation,
	useUpdateQuantityMutation,
} from "@/apis/cart";
import { Button } from "@/components/atomics/button";
import type { AutocompleteOption } from "@/components/composed/autocomplete";
import { AutocompleteInput } from "@/components/composed/autocomplete";
import type { CartItem as CartItemUi } from "@/components/features/cart";
import { CartSample } from "@/components/features/cart";
import { useFlow } from "@/core/flow/useFlow";
import { useToast } from "@/core/toast";
import { css } from "@/styled-system/css";

const productOptions: AutocompleteOption[] = [
	{ label: "Sample Product", value: "prod-sample" },
	{ label: "Widget Pro", value: "prod-widget" },
	{ label: "Gadget Plus", value: "prod-gadget" },
];

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

const mapCartItemToUi = (item: ApiCartItem): CartItemUi => ({
	id: item.id,
	productId: item.productId,
	productName: item.productName,
	quantity: item.quantity,
});

/**
 * Module C: business module entry. Aggregate features and coordinate interactions here.
 * Redux/RTK Query/useToast are used here and passed to CartSample via props.
 */
export function ModuleC() {
	const { toast } = useToast();
	const { setModuleState } = useFlow();
	const { data: apiItems = [], isLoading, error } = useGetCartQuery();
	const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
	const [updateQuantity] = useUpdateQuantityMutation();
	const [removeFromCart] = useRemoveFromCartMutation();
	const [busyItemIds, setBusyItemIds] = useState<Set<string>>(new Set());
	const [selectedProduct, setSelectedProduct] = useState<string>("");

	const handleAddItem = useCallback(() => {
		addToCart({
			productId: "prod-sample",
			productName: "Sample Product",
			quantity: 1,
		})
			.unwrap()
			.then(() => {
				toast.success({
					title: "Added to cart",
					description: "Sample Product has been added.",
				});
			})
			.catch(() => {
				toast.error({
					title: "Failed to add",
					description: "Could not add item to cart.",
				});
			});
	}, [addToCart, toast]);

	const handleUpdateQuantity = useCallback(
		(itemId: string, quantity: number) => {
			setBusyItemIds((prev) => new Set(prev).add(itemId));
			updateQuantity({ itemId, quantity })
				.unwrap()
				.finally(() => {
					setBusyItemIds((prev) => {
						const next = new Set(prev);
						next.delete(itemId);
						return next;
					});
				});
		},
		[updateQuantity],
	);

	const handleRemove = useCallback(
		(itemId: string) => {
			setBusyItemIds((prev) => new Set(prev).add(itemId));
			removeFromCart({ itemId })
				.unwrap()
				.finally(() => {
					setBusyItemIds((prev) => {
						const next = new Set(prev);
						next.delete(itemId);
						return next;
					});
				});
		},
		[removeFromCart],
	);

	const items: CartItemUi[] = apiItems.map(mapCartItemToUi);

	return (
		<div>
			<div className={css({ marginBottom: "1.5rem" })}>
				<p
					className={css({
						fontSize: "md",
						fontWeight: "semibold",
						marginBottom: "0.5rem",
					})}
				>
					Autocomplete example
				</p>
				<AutocompleteInput
					options={productOptions}
					placeholder="Search product..."
					value={selectedProduct}
					onValueChange={({ value, item }) => {
						setSelectedProduct(value);
						toast.success({
							title: "Selected",
							description: `You selected: ${item.label}`,
						});
					}}
					id="module-c-product-autocomplete"
				/>
				{selectedProduct && (
					<p
						className={css({
							fontSize: "sm",
							color: "gray.600",
							marginTop: "0.25rem",
						})}
					>
						Current:{" "}
						{productOptions.find((o) => o.value === selectedProduct)?.label ??
							selectedProduct}
					</p>
				)}
			</div>
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
			<CartSample
				items={items}
				isLoading={isLoading}
				error={!!error}
				onAddItem={handleAddItem}
				isAdding={isAdding}
				onUpdateQuantity={handleUpdateQuantity}
				onRemove={handleRemove}
				busyItemIds={busyItemIds}
			/>
		</div>
	);
}
