import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { ValueState } from '$lib/types/valueState';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';

export const GET = createWidgetEndpoint(
	'system/network/totalUp',
	async (): Promise<TextDataWidgetValue> => {
		const ns = await si.networkStats('*');
		const totalTransmitted = ns.reduce((acc, curr) => acc + curr.tx_bytes, 0);
		return {
			displayValue: filesize(totalTransmitted, { round: 1 }),
			classification: ValueState.Success
		};
	}
);
