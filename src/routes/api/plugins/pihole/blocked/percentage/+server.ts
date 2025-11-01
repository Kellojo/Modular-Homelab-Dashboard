import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../../PiholeClient';

export const GET = createWidgetEndpoint(
	'pihole/blocked/percentage',
	async (): Promise<FillDataWidgetValue> => {
		const piholeClient = new PiholeClient();
		const stats = await piholeClient.getStatsSummary();
		const piholeUrl = await piholeClient.getPiholeUrl();

		return {
			value: stats.queries.percent_blocked,
			classification: ValueState.Success,
			displayValue: `${stats.queries.percent_blocked.toFixed(2)}%`,
			url: piholeUrl || undefined,
			unit: '%',
			tooltip: `Percentage of blocked DNS requests: ${stats.queries.percent_blocked.toFixed(1)}%`
		};
	}
);
