import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { getValueState } from '$lib/types/valueState';

export const GET = createWidgetEndpoint('system/disk', async () => {
	const fsSize = await si.fsSize();
	const used = fsSize.reduce((acc, curr) => acc + curr.used, 0);
	const size = fsSize.reduce((acc, curr) => acc + curr.size, 0);

	return {
		displayValue: `${filesize(used, {
			round: 1
		})} / ${filesize(size, {
			round: 1
		})}`,
		value: (used / size) * 100,
		classification: getValueState((used / size) * 100, { warning: 70, error: 90 }),
		unit: '%',
		min: 0,
		max: 100
	};
});
