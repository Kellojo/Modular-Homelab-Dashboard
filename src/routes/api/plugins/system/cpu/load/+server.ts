import { getValueStateLIB } from '../../../../../../lib/types/valueState';
import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint(
	'system/cpu/load',
	async (): Promise<FillDataWidgetValue> => {
		const cpuLoad = await si.currentLoad();
		const displayValue = cpuLoad.currentLoad.toFixed(1);
		return {
			value: cpuLoad.currentLoad,
			classification: getValueStateLIB(cpuLoad.currentLoad, { warning: 50, error: 80 }),
			displayValue: `${displayValue}%`,
			unit: '%',
			min: 0,
			max: 100,
			tooltip: `${new Date().toLocaleString()}: ${displayValue}%`
		};
	}
);
