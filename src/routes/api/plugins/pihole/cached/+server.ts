import { formatInteger } from '$lib/server/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/cached', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getHistory();
	const piholeUrl = await piholeClient.getPiholeUrl();

	const current = stats.history.reduce((res, entry) => res + entry.cached, 0);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: formatInteger(current),
			value: current,
			classification: ValueState.Success,
			unit: '',
			url: piholeUrl || undefined
		},
		history: stats.history.map((entry) => ({
			timestamp: new Date(entry.timestamp * 1000),
			value: {
				displayValue: formatInteger(entry.cached),
				value: entry.cached,
				classification: ValueState.Success,
				unit: ''
			}
		}))
	};

	return response;
});
