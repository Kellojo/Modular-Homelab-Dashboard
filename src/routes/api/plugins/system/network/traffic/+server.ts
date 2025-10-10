import { filesize } from 'filesize';
import { getValueState, ValueState } from '../../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { TextDataWidgetValue } from '../../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getTraffic());
}

async function getTraffic(): Promise<TextDataWidgetValue> {
	const ns = await si.networkStats('*');
	const totalTransmitted = ns.reduce((acc, curr) => acc + curr.tx_sec, 0);
	const details = filesize(totalTransmitted, { round: 1, output: 'object' });
	return {
		displayValue: `${filesize(totalTransmitted, { round: 1 })}/s`,
		classification: ValueState.Success
	};
}
