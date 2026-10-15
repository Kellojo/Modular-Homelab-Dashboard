import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient from '../ChattyClient';

export const GET = createWidgetEndpoint(
	'chatty/conversations',
	async (): Promise<FillDataWidgetValue> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();
		const count = stats.conversations;

		return {
			value: count,
			classification: count > 0 ? ValueState.Success : ValueState.Unknown,
			unit: 'Conversations',
			displayValue: `${count.toLocaleString()} ${count === 1 ? 'conversation' : 'conversations'}`,
			url: (await chattyClient.getChattyUrl()) || '',
			tooltip: `Total conversations: ${count}`
		};
	}
);