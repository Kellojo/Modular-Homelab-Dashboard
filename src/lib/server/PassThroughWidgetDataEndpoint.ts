import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { json, type RequestHandler } from '@sveltejs/kit';
import {
	StandardWidgetDataEndpointOptions,
	type WidgetResponseFn
} from './StandardWidgetDataEndpoint';
import { logError } from '$lib/common/Logger';

export function createPassThroughHistoryEndpoint(
	name: string,
	fetchFn: WidgetResponseFn,
	options: StandardWidgetDataEndpointOptions = new StandardWidgetDataEndpointOptions()
): RequestHandler {
	return async ({ url }) => {
		try {
			const response: DataWidgetResponse<FillDataWidgetValue> = await fetchFn(url);
			return json(response);
		} catch (err: any) {
			if (err instanceof Error) {
				logError(`Error in widget ${name}: ${err.message}`, 'WIDGET');
			}
			return json({ error: err.message }, { status: 500 });
		}
	};
}
