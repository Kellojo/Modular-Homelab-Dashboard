import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createWidgetEndpoint('pihole/blockedPercentage', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getStatsSummary();

	return {
		value: stats.queries.percent_blocked,
		classification: ValueState.Success,
		displayValue: `${stats.queries.percent_blocked.toFixed(2)}%`
	};
});
