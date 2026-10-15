import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient from '../ChattyClient';

export const GET = createWidgetEndpoint(
	'chatty/custom-mappings',
	async (): Promise<FillDataWidgetValue> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();
		const count = stats.customMappings;

		return {
			value: count,
			classification: ValueState.Info,
			unit: 'Mappings',
			displayValue: `${count} ${count === 1 ? 'mapping' : 'mappings'}`,
			url: (await chattyClient.getChattyUrl()) || '',
			tooltip: `Custom model mappings: ${count}`
		};
	}
);