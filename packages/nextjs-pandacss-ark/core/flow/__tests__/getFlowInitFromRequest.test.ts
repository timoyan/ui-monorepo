import { describe, expect, it } from "vitest";
import { getFlowInitFromRequest } from "@/core/flow/getFlowInitFromRequest";
import type { GetServerSidePropsContext } from "next";

function createContext(
	query: GetServerSidePropsContext["query"],
): GetServerSidePropsContext {
	return {
		req: {} as GetServerSidePropsContext["req"],
		res: {} as GetServerSidePropsContext["res"],
		query,
		resolvedUrl: "/",
		params: undefined,
		locales: undefined,
		locale: undefined,
		defaultLocale: undefined,
		preview: false,
		previewData: undefined,
	} as GetServerSidePropsContext;
}

describe("getFlowInitFromRequest", () => {
	it("returns default order and modules when query is empty", () => {
		const result = getFlowInitFromRequest(createContext({}));
		expect(result.order).toEqual(["A", "B1", "B2", "C"]);
		expect(Object.keys(result.modules)).toEqual(["A", "B1", "B2", "C"]);
		expect(result.modules.A?.state).toBe("INIT");
		expect(result.modules.A?.message).toBe("Accordion example");
	});

	it("uses query.order when provided", () => {
		const result = getFlowInitFromRequest(
			createContext({ order: "C,A,B2,B1" }),
		);
		expect(result.order).toEqual(["C", "A", "B2", "B1"]);
		expect(result.modules.C?.name).toBe("C");
		expect(result.modules.A?.name).toBe("A");
	});

	it("uses query.modules when order is not set", () => {
		const result = getFlowInitFromRequest(createContext({ modules: "A,B1,C" }));
		expect(result.order).toEqual(["A", "B1", "C"]);
		expect(Object.keys(result.modules)).toEqual(["A", "B1", "C"]);
		expect(result.modules.B2).toBeUndefined();
	});

	it("filters out invalid module names", () => {
		const result = getFlowInitFromRequest(
			createContext({ order: "A,Invalid,B1,X,C" }),
		);
		expect(result.order).toEqual(["A", "B1", "C"]);
	});

	it("trims whitespace in order param", () => {
		const result = getFlowInitFromRequest(
			createContext({ order: " A , B1 , C " }),
		);
		expect(result.order).toEqual(["A", "B1", "C"]);
	});
});
