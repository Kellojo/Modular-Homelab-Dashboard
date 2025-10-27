import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/blocked', async () => {
	const piholeClient = new PiholeClient();
	const history = await piholeClient.getHistory();
	const piholeUrl = await piholeClient.getPiholeUrl();

	const current = history.reduce((res, entry) => res + entry.blocked, 0);

	const currentDisplayValue = formatInteger(current);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: currentDisplayValue,
			value: current,
			classification: ValueState.Success,
			unit: '',
			url: piholeUrl || undefined,
			tooltip: `Total blocked ads: ${currentDisplayValue}`
		},
		history: history.map((entry) => {
			const displayValue = formatInteger(entry.blocked);
			const timestamp = new Date(entry.timestamp * 1000);
			return {
				timestamp: timestamp,
				value: {
					displayValue: displayValue,
					value: entry.blocked,
					classification: ValueState.Success,
					unit: '',
					tooltip: `${displayValue} Blocked DNS requests at ${timestamp.toLocaleString()}`
				}
			};
		})
	};

	return response;
});
