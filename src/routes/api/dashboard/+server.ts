import { json, error } from '@sveltejs/kit';
import getConfig from '../../../lib/server/Config';

export async function GET() {
	try {
		const data = await getConfig();
		return json(data);
	} catch (e) {
		console.error('Error reading dashboard.yaml:', e);
		if (e instanceof Error) return error(500, e.message);
		return error(500, 'Unknown error');
	}
}
