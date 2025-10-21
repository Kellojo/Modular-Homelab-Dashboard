<script lang="ts">
	import { getWidgetDataUrl } from '$lib/common/WidgetDataUrl';
	import Widget from './Widget.svelte';

	let {
		applyResults,
		content,
		refreshInterval = 10000,
		datasource,
		datapoint,
		datafilters = {},
		...props
	} = $props();
	let url = $state(props.url || '');

	$effect(() => {
		let active = true;
		async function poll() {
			while (active) {
				try {
					const response = await fetch(getWidgetDataUrl(datasource, datapoint, datafilters));
					if (!response.ok) throw new Error('Network response was not ok');
					const data = await response.json();

					if (data.current?.url) {
						url = data.current.url;
					}

					await applyResults(data);
				} catch (error) {
					console.error('Error fetching data for widget:', error);
				}

				await new Promise((resolve) => setTimeout(resolve, refreshInterval));
			}
		}
		poll();

		return () => {
			active = false;
		};
	});
</script>

<Widget {...props} {url} {content}></Widget>
