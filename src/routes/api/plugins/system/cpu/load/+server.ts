import { getValueStateLIB } from '../../../../../../lib/types/valueState';
import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';

export const GET = createWidgetEndpoint('system/cpu/load', async () => {
	const cpuLoad = await si.currentLoad();
	return {
		value: cpuLoad.currentLoad,
		classification: getValueStateLIB(cpuLoad.currentLoad, { warning: 50, error: 80 }),
		displayValue: `${cpuLoad.currentLoad.toFixed(1)}%`,
		unit: '%',
		min: 0,
		max: 100
	};
});
