<script lang="ts">
	import Widget from './Widget.svelte';

	let { applyResults, content, refreshInterval = 5000, datasource, datapoint, ...props } = $props();

	$effect(() => {
		let active = true;
		async function poll() {
			while (active) {
				try {
					const response = await fetch(
						`/api/plugins/${datasource}/${datapoint.replaceAll('.', '/')}`
					);
					const data = await response.json();

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

<Widget {...props} {content}></Widget>
