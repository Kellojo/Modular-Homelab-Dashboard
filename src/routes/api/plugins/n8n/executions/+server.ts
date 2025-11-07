import { getDateDaysAgo } from '$lib/common/Date';
import { formatInteger } from '$lib/common/Formatter';
import { createPassThroughHistoryEndpoint } from '$lib/server/PassThroughWidgetDataEndpoint';
import type { DataWidgetResponse, FillDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import N8nClient, { type N8nExecution } from '../N8nClient';
import { N8nExecutionStatus } from '../N8nClient';

export const GET = createPassThroughHistoryEndpoint('n8n/executions', async (url) => {
	const since = getDateDaysAgo(14);
	const n8nClient = new N8nClient();
	const executions = await n8nClient.getAllExecutions(since);

	// aggregate executions by day
	const executionsByDay = new Map<string, N8nExecution[]>();
	for (let execution of executions) {
		const date = new Date(execution.startedAt);
		const dateString = date.toISOString().split('T')[0];

		if (!executionsByDay.has(dateString)) {
			executionsByDay.set(dateString, []);
		}

		executionsByDay.get(dateString)!.push(execution);
	}

	const current = getWidgetValue(executions, 'Overall');
	current.url = (await n8nClient.getN8nUrl()) || '';

	const history: { timestamp: Date; value: FillDataWidgetValue }[] = [];
	executionsByDay.keys().forEach((sKey) => {
		history.push({
			timestamp: new Date(sKey),
			value: getWidgetValue(executionsByDay.get(sKey) || [], sKey)
		});
	});

	const response: DataWidgetResponse<FillDataWidgetValue> = {
		current: current,
		history: history.reverse()
	};

	return response;
});

function getWidgetValue(executions: N8nExecution[], day: string): FillDataWidgetValue {
	const overall = executions.length;
	const erroneous = executions.filter(
		(execution) => execution.status === N8nExecutionStatus.Error
	).length;
	const successful = executions.filter(
		(execution) => execution.status === N8nExecutionStatus.Success
	).length;
	const canceled = executions.filter(
		(execution) => execution.status === N8nExecutionStatus.Canceled
	).length;
	const waiting = executions.filter(
		(execution) => execution.status === N8nExecutionStatus.Waiting
	).length;
	const running = executions.filter(
		(execution) => execution.status === N8nExecutionStatus.Running
	).length;

	let displayValue = `${formatInteger(overall)} executions`;
	if (erroneous > 0) {
		displayValue += `, ${formatInteger(erroneous)} errors`;
	}

	let valueState = ValueState.Success;
	if (erroneous > 0) {
		valueState = ValueState.Warning;
		if (erroneous / overall > 0.5) {
			valueState = ValueState.Error;
		}
	}

	let tooltip = `Executions on ${new Date(day).toLocaleDateString()}:\n`;
	tooltip += `Overall: ${formatInteger(overall)}\n`;
	if (successful > 0) tooltip += `Successful: ${formatInteger(successful)}\n`;
	if (erroneous > 0) tooltip += `Errors: ${formatInteger(erroneous)}\n`;
	if (canceled > 0) tooltip += `Canceled: ${formatInteger(canceled)}\n`;
	if (waiting > 0) tooltip += `Waiting: ${formatInteger(waiting)}\n`;
	if (running > 0) tooltip += `Running: ${formatInteger(running)}\n`;

	return {
		displayValue: displayValue,
		value: overall,
		classification: valueState,
		unit: '',
		tooltip: tooltip.trim()
	};
}
