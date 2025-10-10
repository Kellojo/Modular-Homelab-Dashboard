import { getValueState } from '../../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { FillDataWidgetValue } from '../../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getCpuTemperature());
}

async function getCpuTemperature(): Promise<FillDataWidgetValue> {
	const cpuTemperature = await si.cpuTemperature();
	return {
		value: cpuTemperature.main || 0,
		classification: getValueState(cpuTemperature.main || 0, { warning: 70, error: 90 }),
		unit: '°C',
		displayValue: `${cpuTemperature.main?.toFixed(1) || 'N/A'} °C`,
		min: 0,
		max: 100
	};
}
