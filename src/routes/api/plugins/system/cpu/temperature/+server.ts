import { getValueStateLIB } from '../../../../../../lib/types/valueState';
import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';

export const GET = createWidgetEndpoint('system/cpu/temperature', async () => {
	const cpuTemperature = await si.cpuTemperature();
	const displayValue = cpuTemperature.main?.toFixed(1) || 'N/A';
	return {
		value: cpuTemperature.main || 0,
		classification: getValueStateLIB(cpuTemperature.main || 0, { warning: 70, error: 90 }),
		unit: '°C',
		displayValue: `${displayValue} °C`,
		min: 0,
		max: 100,
		tooltip: `${new Date().toLocaleString()}: ${displayValue} °C`
	};
});
