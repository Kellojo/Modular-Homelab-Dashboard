import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';

export default class GotifyApiClient {
	constructor() {}

	async getGotifyUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.gotify?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getGotifyUrl();

		if (!baseUrl) throw new Error('Gotify URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getAllApplications(): Promise<GotifyApplication[]> {
		const apiUrl = await this.getApiUrl('/application');
		const response = await this.authenticatedFetch(apiUrl);
		return (await response.json()) as GotifyApplication[];
	}

	async getAllClients(): Promise<GotifyClient[]> {
		const apiUrl = await this.getApiUrl('/client');
		const response = await this.authenticatedFetch(apiUrl);
		return (await response.json()) as GotifyClient[];
	}

	async getMessages(since?: number): Promise<GotifyMessageResponse> {
		let apiUrl = await this.getApiUrl('/message');
		if (since !== undefined) {
			apiUrl += `?since=${since}`;
		}
		const response = await this.authenticatedFetch(apiUrl);
		const data: GotifyMessageResponse = await response.json();
		return data;
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const token = env.GOTIFY_CLIENT_TOKEN;
		if (!token) throw new Error('GOTIFY_CLIENT_TOKEN is not set');

		const headers = new Headers(options.headers);
		headers.set('Authorization', `Bearer ${token}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid GOTIFY_CLIENT_TOKEN');
		}

		return response;
	}
}

export interface GotifyApplication {
	id: number;
	name: string;
	description: string;
	internal: boolean;
	image: string;
	defaultPriority: number;
	lastUsed: string;
}

export interface GotifyClient {
	id: number;
	name: string;
	lastUsed: string;
}

export interface GotifyMessageResponse {
	paging: {
		size: number;
		since: number;
		limit: number;
	};
	messages: GotifyMessage[];
}

export interface GotifyMessage {
	id: number;
	appid: number;
	message: string;
	title: string;
	priority: number;
	date: string;
}
