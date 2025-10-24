import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { getValueStateLIB } from '$lib/types/valueState';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint(
	'system/disk',
	async (url: URL): Promise<FillDataWidgetValue> => {
		const fsSize = await si.fsSize();

		const volumeFilter = url.searchParams.get('volume');
		const filteredFsSize = fsSize.filter((fs) => {
			if (!volumeFilter) return true;
			return volumeFilter.includes(fs.mount);
		});

		const used = filteredFsSize.reduce((acc, curr) => acc + curr.used, 0);
		const size = filteredFsSize.reduce((acc, curr) => acc + curr.size, 0);

		const displayValue = `${filesize(used, {
			round: 1
		})} / ${filesize(size, {
			round: 1
		})}`;

		return {
			displayValue: displayValue,
			value: (used / size) * 100,
			classification: getValueStateLIB((used / size) * 100, { warning: 70, error: 90 }),
			unit: '%',
			min: 0,
			max: 100,
			tooltip: `${new Date().toLocaleString()}: ${displayValue}`
		};
	}
);
