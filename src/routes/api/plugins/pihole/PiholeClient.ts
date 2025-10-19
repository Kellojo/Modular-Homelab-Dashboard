import { PIHOLE_PASSWORD } from '$env/static/private';
import getConfig from '$lib/server/Config';

let sid: string | null = null;
let sidExpiry: Date | null = null;
let authPromise: Promise<void> | null = null;

export class PiholeClient {
	constructor() {}

	async authenticate(): Promise<void> {
		if (await this.isAuthenticated()) {
			return;
		}

		if (authPromise) {
			console.log('Authentication already in progress, waiting...');
			return authPromise;
		}

		authPromise = (async () => {
			try {
				console.log('Not authenticated with Pi-hole API, attempting to authenticate...');
				const authUrl = await this.getPiholeApiUrl('/api/auth');

				const response = await fetch(authUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password: PIHOLE_PASSWORD || '' })
				});

				if (!response.ok) {
					if (response.status === 429) {
						throw new Error('Rate limit exceeded while authenticating with Pi-hole API.');
					}
					throw new Error(
						`Error authenticating with Pi-hole API: ${response.status} ${response.statusText}`
					);
				}

				const data = (await response.json()) as PiholeAuthResponse;
				if (!data.session.valid) {
					throw new Error('Invalid Pi-hole credentials.');
				}

				sid = data.session.sid;
				sidExpiry = new Date(Date.now() + data.session.validity * 1000);
				console.log('Successfully authenticated with Pi-hole API.');
			} finally {
				authPromise = null;
			}
		})();

		return authPromise;
	}

	async isAuthenticated(): Promise<boolean> {
		if (sid === null) return false;

		if (sidExpiry && new Date() >= sidExpiry) {
			sid = null;
			sidExpiry = null;
			console.log('Pi-hole session has expired, cleared SID.');
			return false;
		}

		// If we have a SID and it's not expired, verify it's still valid with the server
		try {
			const response = await fetch(await this.getPiholeApiUrl('api/auth'), {
				headers: {
					sid: sid
				}
			});
			if (response.ok) {
				const data: PiholeAuthResponse = (await response.json()) as PiholeAuthResponse;
				if (!data.session.valid) {
					sid = null;
					sidExpiry = null;
					console.log('Pi-hole session not valid, cleared SID.');
					return false;
				}
				return data.session.valid;
			}
		} catch (error) {
			sid = null;
			sidExpiry = null;
		}

		return false;
	}

	async getPiholeApiUrl(apiPath: string): Promise<string> {
		const config = await getConfig();

		const piholeUrl = config.plugins?.pihole?.url;
		if (!piholeUrl) {
			throw new Error('Pi-hole URL is not configured.');
		}

		return new URL(apiPath, piholeUrl).toString();
	}

	async getStatsSummary(): Promise<PiholeStatsSummaryResponse> {
		await this.authenticate();

		const apiUrl = await this.getPiholeApiUrl('/api/stats/summary');
		const response = await fetch(apiUrl, {
			headers: {
				sid: `${sid}`
			}
		});

		if (!response.ok) {
			throw new Error(
				`Error fetching Pi-hole stats summary: ${response.status} ${response.statusText}`
			);
		}
		return (await response.json()) as PiholeStatsSummaryResponse;
	}

	async getHistory(): Promise<PiholeHistoryResponse> {
		await this.authenticate();
		const apiUrl = await this.getPiholeApiUrl('/api/history');
		const response = await fetch(apiUrl, {
			headers: {
				sid: `${sid}`
			}
		});

		if (!response.ok) {
			throw new Error(`Error fetching Pi-hole history: ${response.status} ${response.statusText}`);
		}
		return (await response.json()) as PiholeHistoryResponse;
	}
}

interface PiholeAuthResponse {
	session: {
		valid: boolean;
		sid: string;
		validity: number;
	};
}

interface PiholeStatsSummaryResponse {
	queries: {
		total: number;
		blocked: number;
		percent_blocked: number;
		unique_domains: number;
	};

	clients: {
		active: number;
		total: number;
	};
}

interface PiholeHistoryResponse {
	history: Array<{
		timestamp: number;
		total: number;
		cached: number;
		blocked: number;
		forwarded: number;
	}>;
}
