import { formatDate, getDateDaysAgo } from '$lib/common/Date';
import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyClient, { type GotifyMessage } from '../../GotifyClient';

export const GET = createPassThroughHistoryEndpoint('gotify/messages/new', async (url) => {
	const sinceDays = url.searchParams.get('since');

	const since = getDateDaysAgo(Number(sinceDays) || 14);
	const gotifyClient = new GotifyClient();
	const gotifyUrl = (await gotifyClient.getGotifyUrl()) || '';
	const executions = await gotifyClient.getAllMessages(since);

	// aggregate executions by day
	const messagesByDay = new Map<string, GotifyMessage[]>();
	for (let execution of executions) {
		const date = new Date(execution.date);
		const dateString = date.toISOString().split('T')[0];

		if (!messagesByDay.has(dateString)) {
			messagesByDay.set(dateString, []);
		}

		messagesByDay.get(dateString)!.push(execution);
	}

	const current = getWidgetValue(executions, 'Overall', gotifyUrl);

	const history: { timestamp: Date; value: FillDataWidgetValue }[] = [];
	messagesByDay.keys().forEach((sKey) => {
		history.push({
			timestamp: new Date(sKey),
			value: getWidgetValue(messagesByDay.get(sKey) || [], sKey, gotifyUrl)
		});
	});

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: current,
		history: history.reverse()
	};

	return response;
});

function getWidgetValue(messages: GotifyMessage[], day: string, url: string): FillDataWidgetValue {
	const overall = messages.length;
	return {
		value: overall,
		classification: overall > 0 ? ValueState.Success : ValueState.Unknown,
		unit: 'Messages',
		displayValue: `${formatInteger(overall)} ${overall === 1 ? 'message' : 'messages'}`,
		url: url,
		tooltip: `Messages on ${formatDate(new Date(day))}: ${formatInteger(overall)}`
	};
}
