import { formatInteger } from '$lib/server/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GiteaClient from '../../GiteaClient';

export const GET = createPassThroughHistoryEndpoint('gitea/users/username/heatmap', async (url) => {
	const username = url.searchParams.get('username');
	if (!username) {
		throw new Error('username parameter is required for the heatmap');
	}

	const giteaClient = new GiteaClient();
	const heatmap = await giteaClient.getUserHeatmap(username);

	const overallContributions = heatmap.reduce((sum, entry) => sum + entry.contributions, 0);
	const current = getWidgetValue(overallContributions);
	current.url = (await giteaClient.getGiteaUrl()) || '';

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: current,
		history: heatmap.map((entry) => ({
			timestamp: new Date(entry.timestamp * 1000),
			value: getWidgetValue(entry.contributions)
		}))
	};

	return response;
});

function getWidgetValue(contributions: number): FillDataWidgetValue {
	return {
		displayValue: `${formatInteger(contributions)} contributions`,
		value: contributions,
		classification: ValueState.Success,
		unit: ''
	};
}
