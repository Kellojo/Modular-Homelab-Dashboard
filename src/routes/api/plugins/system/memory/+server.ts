import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { getValueStateLIB } from '$lib/types/valueState';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint('system/memory', async (): Promise<FillDataWidgetValue> => {
	const mem = await si.mem();

	const displayValue = `${filesize(mem.used, {
		round: 1
	})} / ${filesize(mem.total, {
		round: 1
	})}`;

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
