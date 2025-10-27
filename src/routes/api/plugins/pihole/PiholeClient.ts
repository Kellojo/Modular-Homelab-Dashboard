import { env } from '$env/dynamic/private';
import { logInfo, logSuccess } from '$lib/common/Logger';
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
			logInfo('Authentication already in progress, waiting...', 'PIHOLE');
			return authPromise;
		}

		authPromise = (async () => {
			try {
				logInfo('Not authenticated with Pi-hole API, attempting to authenticate...', 'PIHOLE');
				const authUrl = await this.getPiholeApiUrl('/api/auth');

				const response = await fetch(authUrl, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ password: env.PIHOLE_PASSWORD || '' })
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
				logSuccess('Successfully authenticated with Pi-hole API.', 'PIHOLE');
			} finally {
				authPromise = null;
			}
		})();

		return authPromise;
	}

	async logOut(): Promise<void> {
		if (sid === null) {
			sid = null;
			sidExpiry = null;
			return;
		}

		try {
			const logoutUrl = await this.getPiholeApiUrl('/api/auth');
			await fetch(logoutUrl, {
				method: 'DELETE',
				headers: {
					sid: `${sid}`
				}
			});
			logInfo('Logged out from Pi-hole API, cleared SID.', 'PIHOLE');
		} catch (e) {
			logError(`Error logging out from Pi-hole API: ${e}`, 'PIHOLE');
		}

		sid = null;
		sidExpiry = null;
	}

	async isAuthenticated(): Promise<boolean> {
		if (sid === null) return false;

		if (sidExpiry && new Date() >= sidExpiry) {
			await this.logOut();
			sid = null;
			sidExpiry = null;
			logInfo('Pi-hole session has expired, cleared SID.', 'PIHOLE');
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
					logInfo('Pi-hole session not valid, cleared SID.', 'PIHOLE');
					return false;
				}
				return data.session.valid;
			}
		} catch (error) {
			await this.logOut();
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

	async getPiholeUrl(): Promise<string | null> {
		const config = await getConfig();
		const piholeUrl = config.plugins?.pihole?.url;
		if (!piholeUrl) return null;
		return new URL('/admin', piholeUrl).toString();
	}

	async getPiholeSessionCount(): Promise<number> {
		await this.authenticate();

		const apiUrl = await this.getPiholeApiUrl('/api/auth/sessions');
		const response = await fetch(apiUrl, {
			headers: {
				sid: `${sid}`
			}
		});

		if (!response.ok) {
			throw new Error(
				`Error fetching Pi-hole session count: ${response.status} ${response.statusText}`
			);
		}
		const data = (await response.json()) as PiholeSessionResponse;
		return data.sessions.length;
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

	async getHistory(): Promise<PiholeHistoryEntry[]> {
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

		const history = (await response.json()) as PiholeHistoryResponse;
		return this.aggregateHistoryDataByHour(history);
	}

	private aggregateHistoryDataByHour(response: PiholeHistoryResponse): PiholeHistoryEntry[] {
		const hourlyMap = new Map<number, PiholeHistoryEntry>();

		for (const entry of response.history) {
			// Convert timestamp to Date and truncate to the hour
			const date = new Date(entry.timestamp * 1000); // adjust if already ms
			date.setMinutes(0, 0, 0);
			const hourTimestamp = Math.floor(date.getTime() / 1000);

			// Aggregate values by hour
			if (!hourlyMap.has(hourTimestamp)) {
				hourlyMap.set(hourTimestamp, {
					timestamp: hourTimestamp,
					total: 0,
					cached: 0,
					blocked: 0,
					forwarded: 0
				});
			}

			const agg = hourlyMap.get(hourTimestamp)!;
			agg.total += entry.total;
			agg.cached += entry.cached;
			agg.blocked += entry.blocked;
			agg.forwarded += entry.forwarded;
		}

		return Array.from(hourlyMap.values()).sort((a, b) => a.timestamp - b.timestamp);
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
	history: Array<PiholeHistoryEntry>;
}

interface PiholeHistoryEntry {
	timestamp: number;
	total: number;
	cached: number;
	blocked: number;
	forwarded: number;
}

interface PiholeSessionResponse {
	sessions: object[];
}
