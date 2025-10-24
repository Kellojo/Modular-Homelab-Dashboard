import { ValueState } from '../../../../../../lib/types/valueState';
import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint(
	'system/cpu/currentSpeed',
	async (): Promise<FillDataWidgetValue> => {
		const cpuCurrentSpeed = await si.cpuCurrentSpeed();

		return {
			value: cpuCurrentSpeed.avg,
			classification: ValueState.Success,
			unit: 'GHz',
			displayValue: `${cpuCurrentSpeed.avg.toFixed(2)} GHz`,
			min: cpuCurrentSpeed.min,
			max: cpuCurrentSpeed.max,
			tooltip: `${new Date().toLocaleString()}: ${cpuCurrentSpeed.avg.toFixed(2)} GHz`
		};
	}
);
