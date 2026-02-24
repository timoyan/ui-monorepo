import type { GetServerSidePropsContext } from "next";
import type {
	InitModulesStatePayload,
	ModuleName,
	ModuleStatePayload,
} from "@/core/flow/types";

/** Default module config: name → initial message (for INIT state). */
const DEFAULT_MODULE_MESSAGES: Record<ModuleName, string> = {
	A: "Accordion example",
	B1: "Button – variant + size",
	B2: "Button – fullWidth + disabled",
	C: "Cart",
};

/** Default order when no request-specific logic applies. */
const DEFAULT_ORDER: ModuleName[] = ["A", "B1", "B2", "C"];

/**
 * Builds flow init payload from request context. Override or extend this to decide
 * which modules to init and in what order based on URL, cookies, headers, etc.
 *
 * @param context - getServerSideProps context (req, res, query, resolvedUrl, etc.)
 * @returns InitModulesStatePayload for dispatch(initModulesState(...))
 *
 * @example
 * // Custom: only A and C for mobile, different order by query
 * export function getFlowInitFromRequest(context: GetServerSidePropsContext): InitModulesStatePayload {
 *   const isMobile = /Mobile|Android/i.test(context.req.headers["user-agent"] ?? "");
 *   const order = (context.query.order as string)?.split(",").filter(Boolean) as ModuleName[] | undefined;
 *   const moduleNames: ModuleName[] = isMobile ? ["A", "C"] : DEFAULT_ORDER;
 *   const finalOrder = order?.length ? order : moduleNames;
 *   const modules = Object.fromEntries(
 *     finalOrder.map((name) => [name, { name, state: "INIT" as const, message: DEFAULT_MODULE_MESSAGES[name] }])
 *   ) as Partial<Record<ModuleName, ModuleStatePayload>>;
 *   return { modules, order: finalOrder };
 * }
 */
export function getFlowInitFromRequest(
	context: GetServerSidePropsContext,
): InitModulesStatePayload {
	const { query } = context;
	// Example: ?modules=A,B1,C or ?order=C,A,B2,B1
	const orderParam = (query.order as string) ?? (query.modules as string);
	const order: ModuleName[] = orderParam
		? (orderParam.split(",").map((s) => s.trim()) as ModuleName[]).filter(
				(name): name is ModuleName => ["A", "B1", "B2", "C"].includes(name),
			)
		: DEFAULT_ORDER;

	const modules = Object.fromEntries(
		order.map((name) => [
			name,
			{
				name,
				state: "INIT" as const,
				message: DEFAULT_MODULE_MESSAGES[name],
			} as ModuleStatePayload,
		]),
	) as InitModulesStatePayload["modules"];

	return { modules, order };
}
