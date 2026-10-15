import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient from '../ChattyClient';

export const GET = createWidgetEndpoint(
	'chatty/providers',
	async (): Promise<FillDataWidgetValue> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();
		const count = stats.providers;

		return {
			value: count,
			classification: count > 0 ? ValueState.Success : ValueState.Unknown,
			unit: 'Providers',
			displayValue: `${count} ${count === 1 ? 'provider' : 'providers'}`,
			url: (await chattyClient.getChattyUrl()) || '',
			tooltip: `Configured LLM providers: ${count}`
	};
	}
);