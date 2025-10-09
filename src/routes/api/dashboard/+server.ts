import { json, error } from '@sveltejs/kit';
import fs from 'fs';
import yaml from 'yaml';

export async function GET() {
	try {
		const data = fs.readFileSync('../dashboard.yaml', 'utf8');

		try {
			const parsed = yaml.parse(data);
			return json(parsed);
		} catch (e) {
			console.error('Error parsing dashboard.yaml:', e);
			return error(500, {
				message:
					'Failed to parse dashboard configuration. Please check the syntax of the dashboard.yaml file.'
			});
		}
	} catch (e) {
		console.error('Error reading dashboard.yaml:', e);
		return error(500, {
			message: 'Failed to read dashboard configuration. Could not find the dashboard.yaml file.'
		});
	}
}
