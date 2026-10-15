import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient from '../ChattyClient';

export const GET = createWidgetEndpoint(
	'chatty/proxy-requests',
	async (): Promise<FillDataWidgetValue> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();
		const count = stats.proxyRequests;

		return {
			value: count,
			classification: ValueState.Info,
			unit: 'Requests',
			displayValue: `${count.toLocaleString()} ${count === 1 ? 'request' : 'requests'}`,
			url: (await chattyClient.getChattyUrl()) || '',
			tooltip: `Total proxy requests: ${count}`
		};
	}
);