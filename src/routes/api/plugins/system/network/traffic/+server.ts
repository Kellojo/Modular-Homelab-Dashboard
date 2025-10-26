import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { ValueState } from '$lib/types/valueState';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { formatFileSize } from '$lib/common/Formatter';

export const GET = createWidgetEndpoint(
	'system/network/traffic',
	async (): Promise<TextDataWidgetValue> => {
		const ns = await si.networkStats('*');
		const totalTransmitted = ns.reduce((acc, curr) => acc + curr.tx_sec, 0);
		return {
			displayValue: `${formatFileSize(totalTransmitted, 1)}/s`,
			classification: ValueState.Success
		};
	}
);
