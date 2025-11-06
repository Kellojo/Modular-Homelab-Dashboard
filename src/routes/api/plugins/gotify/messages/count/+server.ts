import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyApiClient from '../../GotifyClient';

export const GET = createWidgetEndpoint(
	'gotify/messages/count',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const gotifyClient = new GotifyApiClient();
		const response = await gotifyClient.getMessages();
		const overallMessageCount = response.paging.size;

		let text = `${overallMessageCount} ${overallMessageCount === 1 ? 'message' : 'messages'}`;
		if (overallMessageCount === 0) {
			text = 'No messages found';
		}

		return {
			value: overallMessageCount,
			classification: overallMessageCount > 0 ? ValueState.Success : ValueState.Info,
			unit: 'Messages',
			displayValue: text,
			url: (await gotifyClient.getGotifyUrl()) || '',
			tooltip: `${overallMessageCount} messages present in Gotify`
		};
	}
);
