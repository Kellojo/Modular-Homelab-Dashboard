import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import GiteaClient from '../GiteaClient';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint('gitea/version', async (): Promise<FillDataWidgetValue> => {
	const giteaClient = new GiteaClient();
	const version = await giteaClient.getVersion();
	const url = await giteaClient.getGiteaUrl();

	return {
		value: version,
		classification: version ? ValueState.Success : ValueState.Error,
		displayValue: `v${version}`,
		url: url || '',
		unit: '',
		tooltip: `Gitea version v${version}`
	};
});
