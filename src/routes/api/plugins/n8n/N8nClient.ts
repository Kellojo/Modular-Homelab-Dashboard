import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';

export default class N8nClient {
	constructor() {}

	async getN8nUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.n8n?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getN8nUrl();

		if (!baseUrl) throw new Error('N8N URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getAllExecutions(since?: Date): Promise<N8nExecution[]> {
		const executions: N8nExecution[] = [];
		let nextCursor: string | null = null;
		let shouldContinue = true;

		do {
			let apiUrl = await this.getApiUrl('api/v1/executions');
			if (nextCursor) {
				apiUrl += `?cursor=${nextCursor}`;
			}

			const response = await this.authenticatedFetch(apiUrl);
			const data = await response.json();

			if (since) {
				const filteredExecutions: N8nExecution[] = [];

				for (const execution of data.data) {
					const executionDate = new Date(execution.startedAt);

					if (executionDate >= since) {
						filteredExecutions.push(execution);
					} else {
						shouldContinue = false;
						break;
					}
				}

				executions.push(...filteredExecutions);
			} else {
				executions.push(...data.data);
			}

			nextCursor = data.nextCursor && shouldContinue ? data.nextCursor : null;
		} while (nextCursor);

		return executions;
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const apiKey = env.N8N_API_KEY;
		if (!apiKey) throw new Error('N8N_API_KEY is not set');

		const headers = new Headers(options.headers);
		headers.set('X-N8N-API-KEY', apiKey);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid N8N_API_KEY');
		}

		return response;
	}
}

export interface N8nListResponse<T> {
	data: T[];
	nextCursor: string | null;
}

export interface N8nExecution {
	id: string;
	finished: boolean;
	mode: string;
	retryOf: string | null;
	retrySuccessId: string | null;
	status: N8nExecutionStatus;
	startedAt: string;
	stoppedAt: string;
	workflowId: string;
	waitTill: string | null;
}

export enum N8nExecutionStatus {
	Success = 'success',
	Error = 'error',
	Running = 'running',
	Waiting = 'waiting',
	Canceled = 'canceled'
}
