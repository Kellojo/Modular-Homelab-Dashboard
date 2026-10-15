import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import ChattyClient, { type ChattyDailyCount } from '../../ChattyClient';

export const GET = createPassThroughHistoryEndpoint(
	'chatty/conversations/daily',
	async (_url): Promise<DataWidgetResponse<FillDataWidgetValue>> => {
		const chattyClient = new ChattyClient();
		const stats = await chattyClient.getStatistics();

		const overallConversations = stats.conversationsDaily.reduce((sum, d) => sum + d.count, 0);
		const current = getWidgetValue(overallConversations, 'Overall');
		current.url = (await chattyClient.getChattyUrl()) || '';

		const response: DataWidgetResponse<FillDataWidgetValue> = {
			current,
			history: stats.conversationsDaily.map((d: ChattyDailyCount) => ({
				timestamp: new Date(d.date),
				value: getWidgetValue(d.count, d.date)
			}))
		};

		return response;
	}
);

function getWidgetValue(count: number, day: string): FillDataWidgetValue {
	return {
		displayValue: `${formatInteger(count)} conversations`,
		value: count,
		classification: count > 0 ? ValueState.Success : ValueState.Unknown,
		unit: '',
		tooltip: `Conversations on ${new Date(day).toLocaleDateString()}: ${formatInteger(count)}`
	};
}