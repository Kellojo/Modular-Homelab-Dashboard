import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient from '../ChattyClient';

export const GET = createWidgetEndpoint(
	'chatty/models',
	async (): Promise<FillDataWidgetValue> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();
		const count = stats.overallModels;

		return {
			value: count,
			classification: count > 0 ? ValueState.Success : ValueState.Unknown,
			unit: 'Models',
			displayValue: `${count} ${count === 1 ? 'model' : 'models'}`,
			url: (await chattyClient.getChattyUrl()) || '',
			tooltip: `Overall models available: ${count}`
		};
	}
);