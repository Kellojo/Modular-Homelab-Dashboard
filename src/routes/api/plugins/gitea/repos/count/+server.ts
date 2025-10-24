import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GiteaClient from '../../GiteaClient';

export const GET = createWidgetEndpoint(
	'gitea/repos/count',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const searchParams = new URLSearchParams(url.search);
		const search = searchParams.get('search') || '';

		const giteaClient = new GiteaClient();
		const repos = await giteaClient.getAllRepos({
			search: searchParams.get('search') || ''
		});

		let text = `${repos.length} ${repos.length === 1 ? 'repository' : 'repositories'}`;
		if (repos.length === 0) {
			text = 'No repositories found';
		}

		return {
			value: repos.length,
			classification: repos.length > 0 ? ValueState.Success : ValueState.Error,
			unit: 'Repos',
			displayValue: text,
			min: 0,
			max: repos.length,
			url: (await giteaClient.getGiteaUrl()) || '',
			tooltip: `Total repositories found${search ? ` for "${search}"` : ''}`
		};
	}
);
