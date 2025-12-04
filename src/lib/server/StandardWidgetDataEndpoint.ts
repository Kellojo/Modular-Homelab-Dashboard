import { logError } from '$lib/common/Logger';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { json, type RequestHandler } from '@sveltejs/kit';

export type WidgetFetchFn = (url: URL) => Promise<any>;
export type WidgetResponseFn = (url: URL) => Promise<DataWidgetResponse<FillDataWidgetValue>>;
export class StandardWidgetDataEndpointOptions {
	maxHistory: number = 128;
	minHistoryIntervalSeconds: number = 0.5;
}

const historyStore = new Map<string, { timestamp: Date; value: FillDataWidgetValue }[]>();

/**
 * Create a reusable SvelteKit endpoint with caching & history
 */
export function createWidgetEndpoint(
	name: string | ((url: URL) => string),
	fetchFn: WidgetFetchFn,
	options: StandardWidgetDataEndpointOptions = new StandardWidgetDataEndpointOptions()
): RequestHandler {
	return async ({ url }) => {
		const addToHistory: boolean = url.searchParams.get('addToHistory') === 'true';
		const resolvedHistoryName = typeof name === 'function' ? name(url) : name;

		try {
			if (!historyStore.has(resolvedHistoryName)) {
				historyStore.set(resolvedHistoryName, []);
			}
			const current = await fetchFn(url);

			if (addToHistory) {
				addHistoryEntry(resolvedHistoryName, options, current);
			}
			const history = historyStore.get(resolvedHistoryName)!;
			const response: DataWidgetResponse<FillDataWidgetValue> = {
				current,
				history
			};

			return json(response);
		} catch (err: any) {
			logError(`Error in widget ${resolvedHistoryName}: ${err}`, 'WIDGET');
			return json({ error: err.message }, { status: 500 });
		}
	};
}

function addHistoryEntry(
	name: string,
	options: StandardWidgetDataEndpointOptions,
	value: FillDataWidgetValue
) {
	const history = historyStore.get(name)!;

	if (history.length > 0) {
		const latestEntry = history[history.length - 1];
		const timeDiff = new Date().getTime() - latestEntry.timestamp.getTime();
		const timediffInSeconds = timeDiff / 1000;
		if (timediffInSeconds < options.minHistoryIntervalSeconds) return;
	}

	history.push({ timestamp: new Date(), value });
	if (history.length > options.maxHistory) history.shift();
}
