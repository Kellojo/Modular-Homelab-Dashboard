import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import HomeAssistantApiClient, { getEntityId } from '../HomeAssistantApiClient';

export const GET = createWidgetEndpoint(
	(url: URL) => `homeassistant/state/${getEntityId(url)}`,
	async (url: URL): Promise<FillDataWidgetValue> => {
		const entityId = getEntityId(url);
		if (!entityId) {
			throw new Error('datafilters.entity_id parameter is required for this endpoint');
		}

		const homeAssistantClient = new HomeAssistantApiClient();
		const state = await homeAssistantClient.getState(entityId);
		const area = (await homeAssistantClient.getAreaOfEntity(entityId)) || 'N/A';

		let value = `${state.state}`;
		let unit = state.attributes.unit_of_measurement || '';
		if (!state) {
			value = 'No state found';
			unit = null;
		}
		let displayValue = `${value}${unit ? ` ${unit}` : ''}`;

		return {
			value: value,
			classification: state ? ValueState.Success : ValueState.Error,
			unit: unit,
			displayValue: displayValue,
			url: (await homeAssistantClient.getHomeAssistantUrl()) || '',
			tooltip: `${displayValue}\nEntity: ${state.attributes.friendly_name}\nID: ${state.entity_id}\nArea: ${area}`
		};
	}
);
