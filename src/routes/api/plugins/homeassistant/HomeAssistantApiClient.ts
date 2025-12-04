import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';

export default class HomeAssistantApiClient {
	constructor() {}

	async getHomeAssistantUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.homeassistant?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getHomeAssistantUrl();

		if (!baseUrl) throw new Error('Home Assistant URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getState(entityId: string): Promise<HomeAssistantStateResponse> {
		const apiUrl = await this.getApiUrl(`/api/states/${entityId}`);
		const response = await this.authenticatedFetch(apiUrl);
		return (await response.json()) as HomeAssistantStateResponse;
	}

	async getTemplateResult(template: string): Promise<string> {
		const apiUrl = await this.getApiUrl(`/api/template`);
		const response = await this.authenticatedFetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({ template }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const result = await response.text();
		return result;
	}

	async getAreaOfEntity(entityId: string): Promise<string | null> {
		return this.getTemplateResult(`{{ area_name('${entityId}') }}`);
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const token = env.HOME_ASSISTANT_TOKEN;
		if (!token) throw new Error('HOME_ASSISTANT_TOKEN is not set');

		const headers = new Headers(options.headers);
		headers.set('Authorization', `Bearer ${token}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid HOME_ASSISTANT_TOKEN');
		}

		return response;
	}
}

export function getEntityId(url: URL): string {
	return url.searchParams.get('entity_id') || '';
}

export interface HomeAssistantStateResponse {
	entity_id: string;
	state: string;
	attributes: Record<string, any>;

	last_changed: string;
	last_updated: string;

	context: {
		id: string;
		user_id: string | null;
	};
}
