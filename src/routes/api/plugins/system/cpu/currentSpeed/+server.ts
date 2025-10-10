import { getValueState, ValueState } from '../../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { FillDataWidgetValue } from '../../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getCpuSpeed());
}

async function getCpuSpeed(): Promise<FillDataWidgetValue> {
	const cpuCurrentSpeed = await si.cpuCurrentSpeed();
	return {
		value: cpuCurrentSpeed.avg,
		classification: ValueState.Success,
		unit: 'GHz',
		displayValue: `${cpuCurrentSpeed.avg.toFixed(2)} GHz`,
		min: cpuCurrentSpeed.min,
		max: cpuCurrentSpeed.max
	};
}
