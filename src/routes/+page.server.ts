import getConfig from './api/config';
import { error } from '@sveltejs/kit';

export async function load() {
	try {
		const data = await getConfig();
		return data;
	} catch (e) {
		console.error('Error reading dashboard.yaml:', e);
		if (e instanceof Error) return error(500, e.message);
		return error(500, 'Unknown error');
	}
}
