import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import HomeAssistantApiClient from '../HomeAssistantApiClient';

export const GET = createWidgetEndpoint(
	'homeassistant/state', // <-- todo, dynamically create history entry for specific entity
	async (url: URL): Promise<FillDataWidgetValue> => {
		const entityId = url.searchParams.get('entity_id');
		if (!entityId) {
			throw new Error('entity_id parameter is required for the heatmap');
		}

		const homeAssistantClient = new HomeAssistantApiClient();
		const state = await homeAssistantClient.getState(entityId);

		let text = `${state.state}`;
		let unit = state.attributes.unit_of_measurement || '';
		if (!state) {
			text = 'No state found';
			unit = null;
		}

		return {
			value: text,
			classification: state ? ValueState.Success : ValueState.Error,
			unit: unit,
			displayValue: `${text}${unit ? ` ${unit}` : ''}`,
			url: (await homeAssistantClient.getHomeAssistantUrl()) || '',
			tooltip: `${state.entity_id} state in Home Assistant`
		};
	}
);
