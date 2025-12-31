import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GitHubApiClient from '../../../GitHubApiClient';

export const GET = createPassThroughHistoryEndpoint('github/self/followers', async () => {
	const user = await new GitHubApiClient().getUser();
	const currentDisplayValue = formatInteger(user.followers);

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: {
			displayValue: currentDisplayValue,
			value: user.followers,
			classification: ValueState.Success,
			unit: '',
			url: user.html_url || undefined,
			tooltip: `Followers: ${currentDisplayValue}`
		},
		history: []
	};

	return response;
});
