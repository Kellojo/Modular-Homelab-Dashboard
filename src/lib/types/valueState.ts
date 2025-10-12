export enum ValueState {
	Success = 'success',
	Warning = 'warning',
	Error = 'error',
	Info = 'info',
	Unknown = 'unknown'
}

/**
 * Lower is better
 */
export function getValueStateLIB(
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

/**
 * Higher is better
 */
export function getValueStateHIB(
	value: number,
	thresholds: { warning: number; error: number }
): ValueState {
	if (value <= thresholds.error) {
		return ValueState.Error;
	} else if (value <= thresholds.warning) {
		return ValueState.Warning;
	} else {
		return ValueState.Success;
	}
}
