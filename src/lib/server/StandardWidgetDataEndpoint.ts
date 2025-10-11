import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { json, type RequestHandler } from '@sveltejs/kit';

type WidgetFetchFn = () => Promise<any>;
class StandardWidgetDataEndpointOptions {
	maxHistory: number = 5;
	minHistoryIntervalSeconds: number = 30;
}

const historyStore = new Map<string, { timestamp: Date; value: any }[]>();

/**
 * Create a reusable SvelteKit endpoint with caching & history
 */
export function createWidgetEndpoint(
	name: string,
	fetchFn: WidgetFetchFn,
	options: StandardWidgetDataEndpointOptions = new StandardWidgetDataEndpointOptions()
): RequestHandler {
	if (!historyStore.has(name)) {
		historyStore.set(name, []);
	}

	return async () => {
		try {
			const current = await fetchFn();

			addHistoryEntry(name, options, current);
			const history = historyStore.get(name)!;
			const response: DataWidgetResponse<FillDataWidgetValue> = {
				current,
				history
			};

			return json(response);
		} catch (err: any) {
			console.error(`Error in widget ${name}:`, err);
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
