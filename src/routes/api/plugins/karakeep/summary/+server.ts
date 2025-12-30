import { formatInteger } from '$lib/common/Formatter';
import { createWidgetEndpoint } from '$lib/server/StandardWidgetDataEndpoint';
import type { TextDataWidgetValue } from '$lib/types/DataWidgetValueTypes';
import { ValueState } from '$lib/types/valueState';
import KarakeepApiClient from '../KarakeepApiClient';

export const GET = createWidgetEndpoint(
	'karakeep/summary',
	async (): Promise<TextDataWidgetValue> => {
		const karakeepApiClient = new KarakeepApiClient();

		const lists = await karakeepApiClient.getAllLists();
		const bookmarks = await karakeepApiClient.getAllBookmarks();
		const tags = await karakeepApiClient.getAllTags();

		const listsCount = lists.length;
		const bookmarksCount = bookmarks.length;
		const tagsCount = tags.length;

		const parts = [];
		if (bookmarksCount > 0)
			parts.push(`${formatInteger(bookmarksCount)} bookmark${bookmarksCount !== 1 ? 's' : ''}`);
		if (listsCount > 0)
			parts.push(`${formatInteger(listsCount)} list${listsCount !== 1 ? 's' : ''}`);
		if (tagsCount > 0) parts.push(`${formatInteger(tagsCount)} tag${tagsCount !== 1 ? 's' : ''}`);

		const displayValue = parts.join(', ');

		return {
			classification: ValueState.Success,
			displayValue: displayValue,
			url: (await karakeepApiClient.getKarakeepUrl()) || ''
		};
	}
);
