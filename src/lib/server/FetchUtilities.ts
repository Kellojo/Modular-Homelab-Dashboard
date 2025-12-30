export async function fetchAllPaginatedResults<T>(
	fetchFunction: (
		cursor: string | number | null
	) => Promise<{ cursor: string | number | null; results: T[] }>
): Promise<T[]> {
	const results: T[] = [];
	let nextCursor: string | number | null = null;

	do {
		const { cursor, results: newResults } = await fetchFunction(nextCursor);
		nextCursor = cursor;
		results.push(...newResults);
	} while (nextCursor);

	return results;
}
