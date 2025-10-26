import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { getValueStateLIB } from '$lib/types/valueState';
import type { FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { formatFileSize } from '$lib/common/Formatter';

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

		const displayValue = `${formatFileSize(used, 1)} / ${formatFileSize(size, 1)}`;

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
