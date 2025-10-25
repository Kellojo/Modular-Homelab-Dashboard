import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { formatFileSize } from '$lib/server/Formatter';

export const GET = createWidgetEndpoint(
	'system/network/totalUp',
	async (): Promise<TextDataWidgetValue> => {
		const ns = await si.networkStats('*');
		const totalTransmitted = ns.reduce((acc, curr) => acc + curr.tx_bytes, 0);
		return {
			displayValue: formatFileSize(totalTransmitted, 1),
			classification: ValueState.Success
		};
	}
);
