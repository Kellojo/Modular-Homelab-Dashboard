import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import GotifyApiClient from '../../GotifyClient';

export const GET = createWidgetEndpoint(
	'gotify/clients/count',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const gotifyClient = new GotifyApiClient();
		const clients = await gotifyClient.getAllClients();

		let text = `${clients.length} ${clients.length === 1 ? 'client' : 'clients'}`;
		if (clients.length === 0) {
			text = 'No clients found';
		}

		return {
			value: clients.length,
			classification: clients.length > 0 ? ValueState.Success : ValueState.Error,
			unit: 'Clients',
			displayValue: text,
			min: 0,
			max: clients.length,
			url: (await gotifyClient.getGotifyUrl()) || '',
			tooltip: `${clients.length} clients configured in Gotify`
		};
	}
);
