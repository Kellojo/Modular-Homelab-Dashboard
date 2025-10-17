import { formatInteger } from '$lib/server/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../../PiholeClient';

export const GET = createWidgetEndpoint('pihole/clients/active', async () => {
	const piholeClient = new PiholeClient();
	const stats = await piholeClient.getStatsSummary();

	return {
		value: stats.clients.active,
		classification: ValueState.Success,
		displayValue: `${formatInteger(stats.clients.active)}`
	};
});
