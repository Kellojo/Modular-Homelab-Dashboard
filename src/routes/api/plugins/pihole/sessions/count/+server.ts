import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { PiholeClient } from '../../PiholeClient';

export const GET = createWidgetEndpoint(
	'pihole/sessions/count',
	async (): Promise<FillDataWidgetValue> => {
		const piholeClient = new PiholeClient();
		const sessionCount = await piholeClient.getPiholeSessionCount();
		const piholeUrl = await piholeClient.getPiholeUrl();

		return {
			value: sessionCount,
			classification: ValueState.Success,
			displayValue: `${formatInteger(sessionCount)}`,
			url: piholeUrl || undefined,
			unit: '',
			tooltip: `Number of active sessions: ${formatInteger(sessionCount)} at ${new Date().toLocaleString()}`
		};
	}
);
