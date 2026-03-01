import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrlForEndpoint } from "./helpers/getBaseUrlForEndpoint";

const dynamicBaseQuery: BaseQueryFn = async (args, api, extraOptions) => {
	const baseUrl = getBaseUrlForEndpoint(api.endpoint);
	return fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			headers.set("Content-Type", "application/json");
			return headers;
		},
	})(args, api, extraOptions);
};

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: dynamicBaseQuery,
	endpoints: () => ({}),
	tagTypes: ["Cart"],
});
