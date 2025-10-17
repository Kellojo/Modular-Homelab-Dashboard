import { formatInteger } from '$lib/server/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/blocked', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getHistory();

	const current = stats.history.length > 0 ? stats.history[stats.history.length - 1].blocked : 0;

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: formatInteger(current),
			value: current,
			classification: ValueState.Success,
			unit: ''
		},
		history: stats.history.map((entry) => ({
			timestamp: new Date(entry.timestamp * 1000),
			value: {
				displayValue: formatInteger(entry.blocked),
				value: entry.blocked,
				classification: ValueState.Success,
				unit: ''
			}
		}))
	};

	return response;
});
