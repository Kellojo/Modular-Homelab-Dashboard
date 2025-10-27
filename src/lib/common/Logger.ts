import signale from 'signale';

signale.config({
	displayTimestamp: true,
	displayDate: true
});

export function logInfo(message: string, scope: string): void {
	signale.scope(scope).info(message);
}

export function logSuccess(message: string, scope: string): void {
	signale.scope(scope).success(message);
}

export function logWarn(message: string, scope: string): void {
	signale.scope(scope).warn(message);
}

export function logError(message: string, scope: string): void {
	signale.scope(scope).error(message);
}

export function logDebug(message: string, scope: string): void {
	signale.scope(scope).debug(message);
}

export default {
	logInfo,
	logWarn,
	logError,
	logDebug
};
