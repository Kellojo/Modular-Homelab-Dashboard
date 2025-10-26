import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createPassThroughHistoryEndpoint('pihole/forwarded', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getHistory();
	const piholeUrl = await piholeClient.getPiholeUrl();

	const current = stats.history.reduce((res, entry) => res + entry.forwarded, 0);
	const currentDisplayValue = formatInteger(current);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: currentDisplayValue,
			value: current,
			classification: ValueState.Success,
			unit: '',
			url: piholeUrl || undefined,
			tooltip: `Total forwarded DNS requests: ${currentDisplayValue}`
		},
		history: stats.history.map((entry) => {
			const timestamp = new Date(entry.timestamp * 1000);
			return {
				timestamp: timestamp,
				value: {
					displayValue: formatInteger(entry.forwarded),
					value: entry.forwarded,
					classification: ValueState.Success,
					unit: '',
					tooltip: `Forwarded DNS requests at ${timestamp.toLocaleString()}: ${formatInteger(entry.forwarded)}`
				}
			};
		})
	};

	return response;
});
