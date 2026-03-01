import { useEffect, useState } from "react";
import { Button } from "@/components/atomics/button";
import { css } from "@/styled-system/css";

const sectionStyles = css({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1rem",
	w: "full",
	maxW: "md",
});

const listStyles = css({
	w: "full",
	display: "flex",
	flexDirection: "column",
	gap: 2,
});

const itemStyles = css({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: 3,
	p: 3,
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "gray.200",
	bg: "gray.50",
});

const quantityRowStyles = css({
	display: "flex",
	alignItems: "center",
	gap: 2,
});

const quantityInputStyles = css({
	w: "3rem",
	px: 2,
	py: 1,
	textAlign: "center",
	fontSize: "sm",
	borderRadius: "md",
	borderWidth: "1px",
	borderColor: "gray.300",
});

/**
 * Ui-level representation of a cart item.
 * This type is owned by the feature and independent from API response types.
 */
export interface CartItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
}

export interface CartSampleProps {
	items: CartItem[];
	isLoading: boolean;
	error: boolean;
	onAddItem: () => void;
	isAdding: boolean;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemove: (itemId: string) => void;
	/** Item Ids currently being updated or removed (buttons disabled). */
	busyItemIds?: Set<string>;
}

function CartItemRow({
	item,
	onUpdateQuantity,
	onRemove,
	busy,
}: {
	item: CartItem;
	onUpdateQuantity: (itemId: string, quantity: number) => void;
	onRemove: (itemId: string) => void;
	busy: boolean;
}) {
	const [inputQty, setInputQty] = useState(item.quantity);

	useEffect(() => {
		setInputQty(item.quantity);
	}, [item.quantity]);

	const handleQuantityChange = (newQuantity: number) => {
		const qty = Math.max(1, Math.floor(newQuantity));
		onUpdateQuantity(item.id, qty);
		setInputQty(qty);
	};

	const handleBlur = () => {
		const qty = Math.max(1, Math.floor(inputQty));
		if (qty !== item.quantity) {
			onUpdateQuantity(item.id, qty);
		} else {
			setInputQty(item.quantity);
		}
	};

	return (
		<div className={itemStyles}>
			<div
				className={css({
					flex: 1,
					minW: 0,
				})}
			>
				<p className={css({ fontWeight: "semibold", truncate: true })}>
					{item.productName}
				</p>
				<p className={css({ fontSize: "sm", color: "gray.600" })}>
					Id: {item.productId}
				</p>
			</div>
			<div className={quantityRowStyles}>
				<Button
					variant="secondary"
					size="sm"
					disabled={busy || item.quantity <= 1}
					onClick={() => handleQuantityChange(item.quantity - 1)}
					aria-label="Decrease quantity"
				>
					−
				</Button>
				<input
					type="number"
					className={quantityInputStyles}
					value={inputQty}
					min={1}
					onChange={(e) =>
						setInputQty(Math.max(1, Math.floor(Number(e.target.value)) || 1))
					}
					onBlur={handleBlur}
					onKeyDown={(e) =>
						e.key === "Enter" && (e.target as HTMLInputElement).blur()
					}
					disabled={busy}
					aria-label={`Quantity for ${item.productName}`}
				/>
				<Button
					variant="secondary"
					size="sm"
					disabled={busy}
					onClick={() => handleQuantityChange(item.quantity + 1)}
					aria-label="Increase quantity"
				>
					+
				</Button>
				<Button
					variant="danger"
					size="sm"
					disabled={busy}
					onClick={() => onRemove(item.id)}
					aria-label={`Remove ${item.productName} from cart`}
				>
					Remove
				</Button>
			</div>
		</div>
	);
}

/**
 * Presentational cart sample. No Redux; all data and handlers are passed from the parent.
 * Parent (e.g. ModuleC) should use RTK Query / useToast and pass props.
 */
export function CartSample({
	items,
	isLoading,
	error,
	onAddItem,
	isAdding,
	onUpdateQuantity,
	onRemove,
	busyItemIds = new Set(),
}: CartSampleProps) {
	if (isLoading) {
		return (
			<section className={sectionStyles}>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<div className={listStyles}>Loading cart…</div>
			</section>
		);
	}

	if (error) {
		return (
			<section className={sectionStyles}>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<div
					className={css({
						w: "full",
						p: 4,
						borderRadius: "md",
						borderWidth: "1px",
						borderColor: "red.300",
						bg: "red.50",
						color: "red.700",
					})}
				>
					Failed to load cart
				</div>
			</section>
		);
	}

	return (
		<section className={sectionStyles}>
			<div
				className={css({
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					w: "full",
					gap: 2,
				})}
			>
				<h2 className={css({ fontSize: "lg", fontWeight: "semibold" })}>
					Cart
				</h2>
				<Button
					variant="primary"
					size="sm"
					disabled={isAdding}
					onClick={onAddItem}
				>
					{isAdding ? "Adding…" : "Add item"}
				</Button>
			</div>
			<div className={listStyles}>
				{items.length === 0 ? (
					<div
						className={css({
							w: "full",
							p: 4,
							borderRadius: "md",
							borderWidth: "1px",
							borderColor: "gray.200",
							bg: "gray.50",
							color: "gray.500",
							fontStyle: "italic",
						})}
					>
						Cart is empty.
					</div>
				) : (
					items.map((item) => (
						<CartItemRow
							key={item.id}
							item={item}
							onUpdateQuantity={onUpdateQuantity}
							onRemove={onRemove}
							busy={busyItemIds.has(item.id)}
						/>
					))
				)}
			</div>
		</section>
	);
}
