import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyApiClient from '../../GotifyClient';

let lastMessageCount: number = 0;

export const GET = createWidgetEndpoint(
	'gotify/messages/new',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const addToHistory: boolean = url.searchParams.get('addToHistory') === 'true';

		const gotifyClient = new GotifyApiClient();
		const response = await gotifyClient.getMessages();
		const overallMessageCount = response.paging.size;
		let messageCount = overallMessageCount - lastMessageCount;
		if (messageCount < 0) messageCount = 0;

		if (addToHistory) {
			lastMessageCount = overallMessageCount;
		}

		let text = `${messageCount} ${messageCount === 1 ? 'message' : 'messages'}`;
		if (messageCount === 0) {
			text = 'No messages found';
		}

		return {
			value: messageCount,
			classification: messageCount > 0 ? ValueState.Success : ValueState.Info,
			unit: 'Messages',
			displayValue: text,
			url: (await gotifyClient.getGotifyUrl()) || '',
			tooltip: `${messageCount} messages sent through Gotify`
		};
	}
);
