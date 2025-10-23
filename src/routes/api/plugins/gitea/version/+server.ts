import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import getConfig from '$lib/server/Config';
import { getValueStateHIB, ValueState } from '$lib/types/valueState';
import GiteaClient from '../GiteaClient';

export const GET = createWidgetEndpoint('gitea/version', async () => {
	const config = await getConfig();
	const baseUrl = config.plugins.gitea?.url;

	const giteaClient = new GiteaClient();
	const version = await giteaClient.getVersion();
	const url = await giteaClient.getGiteaUrl();

	return {
		value: version,
		classification: version ? ValueState.Success : ValueState.Error,
		displayValue: `v${version}`,
		url: url
	};
});
