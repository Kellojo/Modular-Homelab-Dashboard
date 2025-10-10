export enum ValueState {
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
	Info = 'info',
	Unknown = 'unknown'
}

export function getValueState(
	value: number,
	thresholds: { warning: number; error: number }
): ValueState {
	if (value >= thresholds.error) {
		return ValueState.Error;
	} else if (value >= thresholds.warning) {
		return ValueState.Warning;
	} else if (value >= 0) {
		return ValueState.Success;
	} else {
		return ValueState.Unknown;
	}
}
