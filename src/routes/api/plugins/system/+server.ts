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
			temperature: {
				value: cpuTemperature.main || 0,
				classification: getValueState(cpuTemperature.main || 0, { warning: 70, error: 90 }),
				unit: '°C',
				displayValue: `${cpuTemperature.main?.toFixed(1) || 'N/A'} °C`,
				min: 0,
				max: 100
			},
			currentSpeed: {
				value: cpuCurrentSpeed.avg,
				classification: ValueState.Success,
				unit: 'GHz',
				displayValue: `${cpuCurrentSpeed.avg.toFixed(2)} GHz`,
				min: cpuCurrentSpeed.min,
				max: cpuCurrentSpeed.max
			},
			load: {
				value: cpuCurrentLoad.currentLoad,
				classification: getValueState(cpuCurrentLoad.currentLoad, { warning: 50, error: 80 }),
				unit: '%',
				displayValue: `${cpuCurrentLoad.currentLoad.toFixed(1)}%`,
				min: 0,
				max: 100
			}
		},

		memory: {
			displayValue: `${filesize(mem.used)} / ${filesize(mem.total)}`,
			value: (mem.used / mem.total) * 100,
			classification: getValueState((mem.used / mem.total) * 100, { warning: 70, error: 90 }),
			unit: '%',
			min: 0,
			max: 100
		}
	};

	return json(response);
}

export interface SystemResponse {
	cpu: { temperature: DataWidgetValue; currentSpeed: DataWidgetValue; load: DataWidgetValue };
	memory: DataWidgetValue;
}

export interface DataWidgetValue {
	displayValue: string;
	value: number | string;
	classification: ValueState;
	unit: string;
	min?: number;
	max?: number;
}
