import { json, error } from '@sveltejs/kit';
import getConfig from '../../../lib/server/Config';
import { logError } from '$lib/common/Logger';

export async function GET() {
	try {
		const data = await getConfig();
		return json(data);
	} catch (e) {
		logError(`Error reading dashboard.yaml: ${e}`, 'CONFIG');
		if (e instanceof Error) return error(500, e.message);
		return error(500, 'Unknown error');
	}
}
