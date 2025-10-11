import * as si from 'systeminformation';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import { filesize } from 'filesize';
import { ValueState } from '$lib/types/valueState';

export const GET = createWidgetEndpoint('system/network/totalDown', async () => {
	const ns = await si.networkStats('*');
	const totalTransmitted = ns.reduce((acc, curr) => acc + curr.rx_bytes, 0);
	const details = filesize(totalTransmitted, { round: 1, output: 'object' });
	return {
		displayValue: filesize(totalTransmitted, { round: 1 }),
		classification: ValueState.Success
	};
});
