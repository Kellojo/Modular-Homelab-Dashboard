import { json } from '@sveltejs/kit';
import * as si from 'systeminformation';
import { filesize } from 'filesize';
import { getValueState, ValueState } from '../../types/valueState';
import type { WidgetData } from '../../config';

export async function GET({ url }) {
	const datapoint = url.searchParams.get('datapoint') || '';

	const response: Partial<SystemResponse> = {};

	if (datapoint.startsWith('cpu')) {
		response.cpu = await getCpuStatus();
	}

	if (datapoint === 'memory') {
		response.memory = await getMemoryStatus();
	}

	if (datapoint === 'disk') {
		response.disk = await getDiskStatus();
	}

	if (datapoint.startsWith('network')) {
		response.network = await getNetworkStats();
	}

	return json(response);
}

async function getCpuStatus() {
	const [cpuTemperature, cpuCurrentSpeed, cpuCurrentLoad] = await Promise.all([
		si.cpuTemperature(),
		si.cpuCurrentSpeed(),
		si.currentLoad()
	]);

	return {
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
	};
}

async function getMemoryStatus(): Promise<DataWidgetValue> {
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

async function getDiskStatus(): Promise<DataWidgetValue> {
	const fsSize = await si.fsSize();
	const used = fsSize.reduce((acc, curr) => acc + curr.used, 0);
	const size = fsSize.reduce((acc, curr) => acc + curr.size, 0);

	return {
		displayValue: `${filesize(used, {
			round: 1
		})} / ${filesize(size, {
			round: 1
		})}`,
		value: (used / size) * 100,
		classification: getValueState((used / size) * 100, { warning: 70, error: 90 }),
		unit: '%',
		min: 0,
		max: 100
	};
}

async function getNetworkStats() {
	const networkStats = await si.networkStats('*');
	return {
		totalUp: getTransmittedNetworkStats(networkStats),
		totalDown: getReceivedNetworkStats(networkStats),
		traffic: getTransmittedPerSecondNetworkStats(networkStats)
	};
}
function getReceivedNetworkStats(
	networkStats: si.Systeminformation.NetworkStatsData[]
): DataWidgetValue {
	const totalReceived = networkStats.reduce((acc, curr) => acc + curr.rx_bytes, 0);
	const details = filesize(totalReceived, { round: 1, output: 'object' });

	return {
		displayValue: filesize(totalReceived, { round: 1 }),
		value: totalReceived,
		classification: ValueState.Success,
		unit: details.unit
	};
}
function getTransmittedNetworkStats(
	networkStats: si.Systeminformation.NetworkStatsData[]
): DataWidgetValue {
	const totalTransmitted = networkStats.reduce((acc, curr) => acc + curr.tx_bytes, 0);
	const details = filesize(totalTransmitted, { round: 1, output: 'object' });
	return {
		displayValue: filesize(totalTransmitted, { round: 1 }),
		value: totalTransmitted,
		classification: ValueState.Success,
		unit: details.unit
	};
}
function getTransmittedPerSecondNetworkStats(
	networkStats: si.Systeminformation.NetworkStatsData[]
): DataWidgetValue {
	const totalTransmitted = networkStats.reduce((acc, curr) => acc + curr.tx_sec, 0);
	const details = filesize(totalTransmitted, { round: 1, output: 'object' });
	return {
		displayValue: `${filesize(totalTransmitted, { round: 1 })}/s`,
		value: totalTransmitted,
		classification: ValueState.Success,
		unit: details.unit + '/s'
	};
}

export interface SystemResponse {
	cpu: { temperature: DataWidgetValue; currentSpeed: DataWidgetValue; load: DataWidgetValue };
	memory: DataWidgetValue;
	disk: DataWidgetValue;
	network: {
		up: DataWidgetValue;
		down: DataWidgetValue;
	};
}

export interface DataWidgetValue {
	displayValue: string;
	value: number | string;
	classification: ValueState;
	unit: string;
	min?: number;
	max?: number;
}
