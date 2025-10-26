import { formatInteger } from '$lib/common/Formatter';
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

	const overallContributions = Object.values(heatmap).reduce((sum, val) => sum + val, 0);
	const current = getWidgetValue(overallContributions, 'Overall');
	current.url = (await giteaClient.getGiteaUrl()) || '';

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: current,
		history: Object.entries(heatmap).map(([day, contributions]) => {
			return {
				timestamp: new Date(day),
				value: getWidgetValue(contributions, day)
			};
		})
	};

	return response;
});

function getWidgetValue(contributions: number, day: string): FillDataWidgetValue {
	const displayValue = `${formatInteger(contributions)} contributions`;
	return {
		displayValue: displayValue,
		value: contributions,
		classification: ValueState.Success,
		unit: '',
		tooltip: `Contributions on ${new Date(day).toLocaleDateString()}: ${formatInteger(contributions)}`
	};
}
