import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../../PiholeClient';

export const GET = createWidgetEndpoint(
	'pihole/clients/active',
	async (): Promise<FillDataWidgetValue> => {
		const piholeClient = new PiholeClient();
		const stats = await piholeClient.getStatsSummary();
		const piholeUrl = await piholeClient.getPiholeUrl();

		return {
			value: stats.clients.active,
			classification: ValueState.Success,
			displayValue: `${formatInteger(stats.clients.active)}`,
			url: piholeUrl || undefined,
			unit: '',
			tooltip: `Number of active clients: ${formatInteger(stats.clients.active)} at ${new Date().toLocaleString()}`
		};
	}
);
