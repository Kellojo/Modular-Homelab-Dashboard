import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/cached', async () => {
	const piholeClient = new PiholeClient();
	const history = await piholeClient.getHistory();
	const piholeUrl = await piholeClient.getPiholeUrl();

	const current = history.reduce((res, entry) => res + entry.cached, 0);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: formatInteger(current),
			value: current,
			classification: ValueState.Success,
			unit: '',
			url: piholeUrl || undefined,
			tooltip: `Total cached DNS requests: ${formatInteger(current)}`
		},
		history: history.map((entry) => {
			const timestamp = new Date(entry.timestamp * 1000);
			const displayValue = formatInteger(entry.cached);
			return {
				timestamp: timestamp,
				value: {
					displayValue: displayValue,
					value: entry.cached,
					classification: ValueState.Success,
					unit: '',
					tooltip: `Cached DNS requests at ${timestamp.toLocaleString()}: ${displayValue}`
				}
			};
		})
	};

	return response;
});
