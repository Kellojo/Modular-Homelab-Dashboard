import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';
import { fetchAllPaginatedResults } from '$lib/server/FetchUtilities';

export default class AirtrailClient {
	constructor() {}

	async getAirtrailUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.airtrail?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getAirtrailUrl();

		if (!baseUrl) throw new Error('AirTrail URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getStats(): Promise<AirtrailStats> {
		const apiUrl = await this.getApiUrl('/api/v1/stats');
		const response = await this.authenticatedFetch(apiUrl);

		if (!response.ok) {
			throw new Error(`Failed to fetch AirTrail statistics: ${response.statusText}`);
		}
		return ((await response.json()) as AirtrailStatsResponse).data;
	}

	async getAllFlights(): Promise<AirtrailFlight[]> {
		return fetchAllPaginatedResults<AirtrailFlight>(async (cursor) => {
			let url = await this.getApiUrl('/api/v1/flights?limit=100');
			if (cursor) {
				url += `&cursor=${cursor}`;
			}
			const response = await this.authenticatedFetch(url);

			if (!response.ok) {
				throw new Error(`Failed to fetch AirTrail flights: ${response.statusText}`);
			}
			const data = (await response.json()) as AirtrailFlightListResponse;
			return {
				cursor: data.page?.nextCursor ?? null,
				results: data.data
			};
		});
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const token = env.AIRTRAIL_TOKEN;
		if (!token) throw new Error('AIRTRAIL_TOKEN is not set');

		const headers = new Headers(options.headers);
		headers.set('Authorization', `Bearer ${token}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid AIRTRAIL_TOKEN');
		}

		return response;
	}
}

export interface AirtrailStatsResponse {
	data: AirtrailStats;
}

export interface AirtrailStats {
	flights: number;
	distanceKm: number;
	durationSeconds: number;
	airports: number;
	topAirline: object | null;
	topAirport: object | null;
	topAircraft: object | null;
	topRoute: object | null;
}

export interface AirtrailFlightListResponse {
	data: AirtrailFlight[];
	page: {
		nextCursor: string | null;
	};
}

export interface AirtrailFlight {
	id: number;
	date: string;
	duration: number | null;
	from: AirTrailAirport | null;
	to: AirTrailAirport | null;
}

export interface AirTrailAirport {
	latitude: number | null;
	longitude: number | null;
}