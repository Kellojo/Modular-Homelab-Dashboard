import getConfig from '$lib/server/Config';

export default class ChattyClient {
	constructor() {}

	async getChattyUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.chatty?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getChattyUrl();

		if (!baseUrl) throw new Error('Chatty URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getStatistics(): Promise<ChattyStatistics> {
		const apiUrl = await this.getApiUrl('/api/statistics');
		const response = await fetch(apiUrl);

		if (!response.ok) throw new Error(`Failed to fetch Chatty statistics: ${response.statusText}`);
		return (await response.json()) as ChattyStatistics;
	}
}

export interface ChattyStatistics {
	proxyRequests: number;
	providers: number;
	customMappings: number;
	overallModels: number;
	conversations: number;
	conversationsDaily: ChattyDailyCount[];
}

export interface ChattyDailyCount {
	date: string;
	count: number;
}