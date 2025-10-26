import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { formatFileSize } from '$lib/common/Formatter';

export const GET = createWidgetEndpoint(
	'system/network/totalDown',
	async (): Promise<TextDataWidgetValue> => {
		const ns = await si.networkStats('*');
		const totalTransmitted = ns.reduce((acc, curr) => acc + curr.rx_bytes, 0);

		return {
			displayValue: formatFileSize(totalTransmitted, 1),
			classification: ValueState.Success
		};
	}
);
