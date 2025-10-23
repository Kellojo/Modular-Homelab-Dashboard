import getConfig from '$lib/server/Config';

export default class GiteaClient {
	constructor() {}

	async getGiteaUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.gitea?.url || null;
	}

	async getVersion(): Promise<string> {
		const baseUrl = await this.getGiteaUrl();
		if (!baseUrl) return 'N/A';

		const response = await fetch(new URL('/api/v1/version', baseUrl).toString());
		const data = await response.json();

		return data.version;
	}
}
