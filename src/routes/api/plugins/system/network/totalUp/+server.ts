import { filesize } from 'filesize';
import { getValueState, ValueState } from '../../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { TextDataWidgetValue } from '../../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getNetworkStatus());
}

async function getNetworkStatus(): Promise<TextDataWidgetValue> {
	const ns = await si.networkStats('*');
	const totalTransmitted = ns.reduce((acc, curr) => acc + curr.tx_bytes, 0);
	const details = filesize(totalTransmitted, { round: 1, output: 'object' });
	return {
		displayValue: filesize(totalTransmitted, { round: 1 }),
		classification: ValueState.Success
	};
}
