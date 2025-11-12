import { getDateDaysAgo } from '$lib/common/Date';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyApiClient from '../../GotifyClient';

export const GET = createWidgetEndpoint(
	'gotify/messages/count',
	async (url: URL): Promise<FillDataWidgetValue> => {
        const sinceDays = url.searchParams.get('since');
        const since = getDateDaysAgo(Number(sinceDays) || 14);

		const gotifyClient = new GotifyApiClient();
		const messages = await gotifyClient.getAllMessages(since);
		const overallMessageCount = messages.length;

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
