import { json } from '@sveltejs/kit';
import * as si from 'systeminformation';
import { filesize } from 'filesize';
import { getValueState, ValueState } from '../../types/valueState';

export async function GET() {
	const [mem, cpuTemperature, cpuCurrentSpeed, cpuCurrentLoad] = await Promise.all([
		si.mem(),
		si.cpuTemperature(),
		si.cpuCurrentSpeed(),
		si.currentLoad()
	]);

	const response: SystemResponse = {
		cpu: {
			temperature: cpuTemperature.main,
			currentSpeed: cpuCurrentSpeed.avg,
			load: {
				value: cpuCurrentLoad.currentLoad,
				classification: getValueState(cpuCurrentLoad.currentLoad, { warning: 50, error: 80 }),
				unit: '%',
				displayValue: `${cpuCurrentLoad.currentLoad.toFixed(1)}%`
			}
		},

		memory: {
			total: filesize(mem.total),
			free: filesize(mem.free),
			used: filesize(mem.used)
		}
	};

	return json(response);
}

export interface SystemResponse {
	cpu: { temperature: number | null; currentSpeed: number; load: DataWidgetValue };
	memory: { total: string; free: string; used: string };
}

export interface DataWidgetValue {
	displayValue: string;
	value: number | string;
	classification: ValueState;
	unit: string;
}
