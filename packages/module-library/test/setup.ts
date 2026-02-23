/**
 * Polyfill requestAnimationFrame for Stencil in happy-dom (Node) test environment.
 */
if (typeof globalThis.requestAnimationFrame === "undefined") {
	globalThis.requestAnimationFrame = (callback: FrameRequestCallback): number => {
		return setTimeout(callback, 0) as unknown as number;
	};
}
if (typeof globalThis.cancelAnimationFrame === "undefined") {
	globalThis.cancelAnimationFrame = (id: number): void => {
		clearTimeout(id);
	};
}
