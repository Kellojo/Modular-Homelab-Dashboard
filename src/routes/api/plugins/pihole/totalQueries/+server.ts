import { formatInteger } from '$lib/server/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../PiholeClient';

export const GET = createWidgetEndpoint('pihole/totalQueries', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getStatsSummary();

	return {
		value: stats.queries.total,
		classification: ValueState.Success,
		displayValue: `${formatInteger(stats.queries.total)} Queries`
	};
});
