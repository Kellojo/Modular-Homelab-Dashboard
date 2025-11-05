import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyApiClient from '../../GotifyClient';

export const GET = createWidgetEndpoint(
	'gotify/applications/count',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const gotifyClient = new GotifyApiClient();
		const apps = await gotifyClient.getAllApplications();

		let text = `${apps.length} ${apps.length === 1 ? 'application' : 'applications'}`;
		if (apps.length === 0) {
			text = 'No applications found';
		}

		return {
			value: apps.length,
			classification: apps.length > 0 ? ValueState.Success : ValueState.Error,
			unit: 'Apps',
			displayValue: text,
			min: 0,
			max: apps.length,
			url: (await gotifyClient.getGotifyUrl()) || '',
			tooltip: `${apps.length} applications configured in Gotify`
		};
	}
);
