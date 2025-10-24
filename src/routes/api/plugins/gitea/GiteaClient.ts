import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';
import * as si from 'systeminformation';

export default class GiteaClient {
	constructor() {}

	async getGiteaUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.gitea?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getGiteaUrl();

		if (!baseUrl) throw new Error('Gitea URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getVersion(): Promise<string> {
		const response = await fetch(await this.getApiUrl('/api/v1/version'));
		const data = await response.json();

		return data.version;
	}

	async getAllRunners(): Promise<GiteaRunner[]> {
		const apiUrl = await this.getApiUrl('/api/v1/admin/actions/runners');
		const response = await this.authenticatedFetch(apiUrl);
		const data: GiteaRunnersResponse = await response.json();
		return data.runners;
	}

	async getAllRepos(filters: { search: string }): Promise<Repository[]> {
		const apiUrl = await this.getApiUrl('/api/v1/repos/search');
		const url = new URL(apiUrl);
		if (filters.search) {
			url.searchParams.append('q', filters.search);
		}

		const response = await this.authenticatedFetch(url.toString());
		const data: RepositorySearchResponse = await response.json();
		return data.data;
	}

	async getUserHeatmap(username: string): Promise<{ [key: string]: number }> {
		const apiUrl = await this.getApiUrl(`/api/v1/users/${username}/heatmap`);
		const response = await this.authenticatedFetch(apiUrl);
		const data: HeatMapResponse = await response.json();

		const groupedByDay: { [key: string]: number } = {};
		data.forEach((entry) => {
			const date = new Date(entry.timestamp * 1000);
			const dayKey = date.toISOString().split('T')[0];
			groupedByDay[dayKey] = (groupedByDay[dayKey] || 0) + entry.contributions;
		});

		return groupedByDay;
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const token = env.GITEA_TOKEN;
		if (!token) throw new Error('GITEA_TOKEN is not set');

		const headers = new Headers(options.headers);
		headers.set('Authorization', `token ${token}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid GITEA_TOKEN');
		}

		return response;
	}
}

interface GiteaRunnersResponse {
	total_count: number;
	runners: GiteaRunner[];
}

export interface GiteaRunner {
	id: number;
	name: string;
	status: string;
	busy: boolean;
	ephemeral: boolean;
	labels: GiteaRunnerLabel[];
}

export interface GiteaRunnerLabel {
	id: number;
	name: string;
	type: string;
}

export interface Repository {
	id: number;
	owner: object;
	name: string;
	full_name: string;
	description: string;
	private: boolean;
	fork: boolean;
	template: boolean;
	mirror: boolean;
	size: number;
	html_url: string;
}

export interface RepositorySearchResponse {
	ok: boolean;
	data: Repository[];
}

export interface HeatMapResponse
	extends Array<{
		timestamp: number;
		contributions: number;
	}> {}
