import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GitHubApiClient from '../../../../GitHubApiClient';

export const GET = createPassThroughHistoryEndpoint(
	'github/repo/[owner]/[repo_name]/stars',
	async (url: URL) => {
		const segments = url.pathname.split('/').filter(Boolean);
		const owner = segments[4];
		const repoName = segments[5];

		const repo = await new GitHubApiClient().getRepo(owner, repoName);
		const currentDisplayValue = formatInteger(repo.stargazers_count);

		const response: DataWidgetResponse<FillDataWidgetValue> = {
			current: {
				displayValue: currentDisplayValue,
				value: repo.stargazers_count,
				classification: ValueState.Success,
				unit: '',
				url: repo.html_url || undefined,
				tooltip: `Stars: ${currentDisplayValue}`
			},
			history: []
		};

		return response;
	}
);
