import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import HomeAssistantApiClient from '../HomeAssistantApiClient';

export const GET = createWidgetEndpoint(
	'homeassistant/summary',
	async (): Promise<TextDataWidgetValue> => {
		const client = new HomeAssistantApiClient();
		const summary = await client.getSummary();
		const url = await client.getHomeAssistantUrl();

		const displayValue = `${summary.total_devices} Devices, ${summary.total_entities} Entities`;

		return {
			displayValue: displayValue,
			classification: ValueState.Success,
			url: url || ''
		};
	}
);
