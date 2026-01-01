const SESSION_EXPIRED_RESPONSE_CODES = [401, 403, 302];

export async function monitorSessionValidity(): Promise<void> {
	console.log('Starting session validity monitoring');
	validateSession();
	setInterval(validateSession, 60000);
    addEventListener('visibilitychange', validateSession);
}

async function validateSession() {
	if (document.hidden) return;

	const isValid = await isSessionValid();
	if (!isValid) {
		console.log('Session expired. Reloading the page.');
		window.location.reload();
	}
}

export async function isSessionValid(): Promise<boolean> {
	try {
		const response = await fetch('/api/health', {
            redirect: 'manual',
        });

		if (!response.ok || SESSION_EXPIRED_RESPONSE_CODES.includes(response.status)) {
			return false;
		}
	} catch (error) {
		console.error(`Session validation failed: ${error}`);
	}

	return true;
}
