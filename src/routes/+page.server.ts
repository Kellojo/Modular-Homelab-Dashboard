import { logError } from '$lib/common/Logger';
import getConfig from '../lib/server/Config';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const data = await getConfig();
		return data;
	} catch (e) {
		logError(`Error reading dashboard.yaml: ${e}`, 'CONFIG');
		if (e instanceof Error) return error(500, e.message);
		return error(500, 'Unknown error');
	}
}
