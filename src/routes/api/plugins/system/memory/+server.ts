import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { getValueStateLIB } from '$lib/types/valueState';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { formatFileSize } from '$lib/server/Formatter';

export const GET = createWidgetEndpoint('system/memory', async (): Promise<FillDataWidgetValue> => {
	const mem = await si.mem();

	const displayValue = `${formatFileSize(mem.used, 1)} / ${formatFileSize(mem.total, 1)}`;

	return {
		displayValue: displayValue,
		value: (mem.used / mem.total) * 100,
		classification: getValueStateLIB((mem.used / mem.total) * 100, { warning: 70, error: 90 }),
		unit: '%',
		min: 0,
		max: 100,
		tooltip: `${new Date().toLocaleString()}: ${displayValue}`
	};
});
