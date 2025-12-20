import { formatFloat, formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import { format } from 'path';
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

		const deviceClass = state.attributes?.device_class || '';
		let unit = state.attributes?.unit_of_measurement || '';
		let value = formatState(state.state, unit, deviceClass);

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

function formatState(state: string, unitOfMeasurement: string, deviceClass: string): string {
	if (deviceClass === 'timestamp') {
		const date = new Date(state);
		return date.toLocaleString();
	}

	const floatVal = parseFloat(state);
	const intVal = parseInt(state, 10);
	switch (unitOfMeasurement) {
		case '%':
			if (!isNaN(floatVal)) return formatFloat(floatVal, 0);
			break;

		case '°C':
		case '°F':
			if (!isNaN(floatVal)) return formatFloat(floatVal, 1);
			break;

		default:
			if (!isNaN(floatVal)) return formatFloat(floatVal);
			if (!isNaN(intVal)) return formatInteger(intVal);
			break;
	}

	return state;
}
