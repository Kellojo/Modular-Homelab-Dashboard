import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';
import { logError } from '$lib/common/Logger';

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

	async getAllDevices(): Promise<HomeAssistantDevice[]> {
		return this.authenticatedWebSocketMessage<HomeAssistantDevice[]>('config/device_registry/list');
	}

	async getAllStates(): Promise<HomeAssistantStateResponse[]> {
		const apiUrl = await this.getApiUrl(`/api/states`);
		const response = await this.authenticatedFetch(apiUrl);
		return (await response.json()) as HomeAssistantStateResponse[];
	}

	async getSummary(): Promise<HomeAssistantSummary> {
		const [states, allDevices] = await Promise.all([this.getAllStates(), this.getAllDevices()]);
		const total_entities = states.length;
		const total_devices = allDevices.length;

		return {
			total_entities,
			total_devices
		};
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

	async authenticatedWebSocketMessage<T>(type: string): Promise<T> {
		const token = env.HOME_ASSISTANT_TOKEN;
		if (!token) throw new Error('HOME_ASSISTANT_TOKEN is not set');

		return new Promise(async (resolve, reject) => {
			let wsUrl = await this.getApiUrl('/api/websocket');
			// Convert http(s) to ws(s)
			wsUrl = wsUrl.replace(/^http/, 'ws');

			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				ws.send(
					JSON.stringify({
						type: 'auth',
						access_token: token
					})
				);
			};

			ws.onmessage = (event) => {
				try {
					const msg = JSON.parse(event.data) as HomeAssistantWebSocketResponse<any>;

					if (msg.type === 'auth_ok') {
						ws.send(
							JSON.stringify({
								id: 1,
								type: type
							})
						);
					}

					if (msg.id === 1 && msg.type === 'result') {
						ws.close();
						resolve(msg.result);
					}

					if (msg.type === 'auth_invalid') {
						ws.close();
						reject(
							new Error('Home Assistant Authentication failed: ' + (msg.message || 'Invalid token'))
						);
					}
				} catch (error) {
					logError('Error parsing WebSocket message:' + error, 'HomeAssistantApiClient');
					reject(new Error('Failed to parse WebSocket message: ' + error));
					ws.close();
				}
			};
			ws.onerror = (error) => {
				logError('WebSocket error:' + error, 'HomeAssistantApiClient');
				reject(error);
				ws.close();
			};

			ws.onclose = (event) => {
				if (event.code !== 1000) {
					logError(
						'WebSocket closed unexpectedly:' + event.code + ' ' + event.reason,
						'HomeAssistantApiClient'
					);
				}
			};
		});
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

export interface HomeAssistantWebSocketResponse<T> {
	id: number;
	type: 'result' | string;
	success: boolean;
	result: T;
}

export interface HomeAssistantDevice {
	area_id: string | null;
	id: string;
	labels: string[];

	manufacturer: string;
	model: string;
	model_id: string | null;

	name_by_user: string;
	name: string;
	primary_config_entry: string;

	modified_at: number;
	created_at: number;
}

export interface HomeAssistantSummary {
	total_entities: number;
	total_devices: number;
}
