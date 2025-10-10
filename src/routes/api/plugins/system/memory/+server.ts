import { filesize } from 'filesize';
import { getValueState } from '../../../types/valueState';
import * as si from 'systeminformation';
import { json } from '@sveltejs/kit';
import type { FillDataWidgetValue } from '../../../types/DataWidgetValueTypes';

export async function GET() {
	return json(await getMemoryStatus());
}

async function getMemoryStatus(): Promise<FillDataWidgetValue> {
	const mem = await si.mem();
	return {
		displayValue: `${filesize(mem.used, {
			round: 1
		})} / ${filesize(mem.total, {
			round: 1
		})}`,
		value: (mem.used / mem.total) * 100,
		classification: getValueState((mem.used / mem.total) * 100, { warning: 70, error: 90 }),
		unit: '%',
		min: 0,
		max: 100
	};
}
