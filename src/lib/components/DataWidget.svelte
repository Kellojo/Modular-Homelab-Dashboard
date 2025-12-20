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
	let initiallyLoaded = $state(false);

	$effect(() => {
		let active = true;
		async function poll() {
			while (active) {
				if (document.hidden && initiallyLoaded) {
					await new Promise((resolve) => setTimeout(resolve, 1000));
					continue;
				}
				initiallyLoaded = true;

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
