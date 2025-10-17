import { PIHOLE_PASSWORD } from '$env/static/private';
import getConfig from '$lib/server/Config';

let sid: string | null = null;
let sidExpiry: Date | null = null;

export class PiholeClient {
	constructor() {}

	async authenticate(): Promise<void> {
		if (await this.isAuthenticated()) {
			console.log('Already authenticated with Pi-hole API.');
			return;
		}

		console.log('Not authenticated with Pi-hole API, attempting to authenticate...');
		const authUrl = await this.getPiholeApiUrl('/api/auth');
		const response = await fetch(authUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				password: PIHOLE_PASSWORD || ''
			})
		});

		if (response.ok) {
			const data: PiholeAuthResponse = await response.json();
			if (!data.session.valid) {
				throw new Error('Invalid Pi-hole credentials.');
			}
			sid = data.session.sid;
			sidExpiry = new Date(Date.now() + data.session.validity * 1000);

			console.log('Successfully authenticated with Pi-hole API.');
		} else {
			throw new Error(
				`Error authenticating with Pi-hole API: ${response.status} ${response.statusText}`
			);
		}
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
				console.log('Pi-hole session is still valid. ' + data.session.valid);
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
		percentage_blocked: number;
		unique_domains: number;
	};

	clients: {
		active: number;
		total: number;
	};
}
