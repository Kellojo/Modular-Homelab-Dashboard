import getConfig from '$lib/server/Config';
import { env } from '$env/dynamic/private';
import { fetchAllPaginatedResults } from '$lib/server/FetchUtilities';

export default class KarakeepApiClient {
	constructor() {}

	async getKarakeepUrl(): Promise<string | null> {
		const config = await getConfig();
		return config.plugins.karakeep?.url || null;
	}

	async getApiUrl(path: string): Promise<string> {
		const baseUrl = await this.getKarakeepUrl();

		if (!baseUrl) throw new Error('Karakeep URL is not configured');
		const url = new URL(path, baseUrl);
		return url.toString();
	}

	async getAllBookmarks(): Promise<KarakeepBookmark[]> {
		const results = await fetchAllPaginatedResults<KarakeepBookmark>(
			async (cursor: string | number | null) => {
				let apiUrl = await this.getApiUrl('/api/v1/bookmarks');
				if (cursor) apiUrl += `?cursor=${cursor}`;

				const response = await this.authenticatedFetch(apiUrl);
				const data: KarakeepBookmarkResponse = await response.json();
				return {
					cursor: data.nextCursor,
					results: data.bookmarks
				};
			}
		);

		return results;
	}

	async getAllTags(): Promise<KarakeepTag[]> {
		const results = await fetchAllPaginatedResults<KarakeepTag>(
			async (cursor: string | number | null) => {
				let apiUrl = await this.getApiUrl('/api/v1/tags');
				if (cursor) apiUrl += `?cursor=${cursor}`;

				const response = await this.authenticatedFetch(apiUrl);
				const data: KarakeepTagResponse = await response.json();
				return {
					cursor: data.nextCursor,
					results: data.tags
				};
			}
		);

		return results;
	}

	async getAllLists(): Promise<KarakeepList[]> {
		const apiUrl = await this.getApiUrl('/api/v1/lists');
		const response = await this.authenticatedFetch(apiUrl);
		const data: KarakeepListResponse = await response.json();
		return data.lists;
	}

	async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
		const apiKey = env.KARAKEEP_API_KEY;
		if (!apiKey) throw new Error('KARAKEEP_API_KEY is not set');

		const headers = new Headers(options.headers);
		headers.set('Authorization', `Bearer ${apiKey}`);

		const response = await fetch(url, {
			...options,
			headers
		});

		if (response.status === 401) {
			throw new Error('Unauthorized: Invalid KARAKEEP_API_KEY');
		}

		return response;
	}
}

export interface KarakeepBookmarkResponse {
	bookmarks: KarakeepBookmark[];
	nextCursor: string | null;
}

export interface KarakeepBookmark {
	id: string;
}

export interface KarakeepListResponse {
	lists: KarakeepList[];
}

export interface KarakeepList {
	id: string;
	name: string;
	description: string;
	icon: string;
}

export interface KarakeepTagResponse {
	tags: KarakeepTag[];
	nextCursor: string | null;
}

export interface KarakeepTag {
	id: string;
}
