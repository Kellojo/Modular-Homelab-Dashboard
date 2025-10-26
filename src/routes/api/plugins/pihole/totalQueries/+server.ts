import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/totalQueries', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getHistory();
	const piholeUrl = await piholeClient.getPiholeUrl();

	const current = stats.history.reduce((res, entry) => res + entry.total, 0);
	const currentDisplayValue = formatInteger(current);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: currentDisplayValue,
			value: current,
			classification: ValueState.Success,
			unit: '',
			url: piholeUrl || undefined,
			tooltip: `Total DNS queries: ${currentDisplayValue}`
		},
		history: stats.history.map((entry) => {
			const timestamp = new Date(entry.timestamp * 1000);
			const displayValue = formatInteger(entry.total);
			return {
				timestamp: timestamp,
				value: {
					displayValue: displayValue,
					value: entry.total,
					classification: ValueState.Success,
					unit: '',
					tooltip: `Total DNS queries at ${timestamp.toLocaleString()}: ${displayValue}`
				}
			};
		})
	};

	return response;
});
