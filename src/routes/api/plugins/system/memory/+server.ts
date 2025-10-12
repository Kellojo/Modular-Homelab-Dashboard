import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { getValueStateLIB } from '$lib/types/valueState';

export const GET = createWidgetEndpoint('system/memory', async () => {
	const mem = await si.mem();
	return {
		displayValue: `${filesize(mem.used, {
			round: 1
		})} / ${filesize(mem.total, {
			round: 1
		})}`,
		value: (mem.used / mem.total) * 100,
		classification: getValueStateLIB((mem.used / mem.total) * 100, { warning: 70, error: 90 }),
		unit: '%',
		min: 0,
		max: 100
	};
});
