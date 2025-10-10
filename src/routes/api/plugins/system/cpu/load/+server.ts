import { getValueState } from '../../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { FillDataWidgetValue } from '../../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getCpuLoad());
}

async function getCpuLoad(): Promise<FillDataWidgetValue> {
	const cpuLoad = await si.currentLoad();
	return {
		value: cpuLoad.currentLoad,
		classification: getValueState(cpuLoad.currentLoad, { warning: 50, error: 80 }),
		unit: '%',
		displayValue: `${cpuLoad.currentLoad.toFixed(1)}%`,
		min: 0,
		max: 100
	};
}
